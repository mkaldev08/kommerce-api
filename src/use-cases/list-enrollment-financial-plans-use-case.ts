import { prisma } from "@/lib/prisma";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export type FinancialPlanFilterStatus = "PENDING" | "PAID" | "OVERDUE" | "ALL";

interface ListEnrollmentFinancialPlansUseCaseRequest {
  businessUnitId: string;
  enrollmentId: string;
  schoolYearId?: string;
  status?: FinancialPlanFilterStatus;
}

interface FinancialPlanItem {
  id: string;
  enrollmentId: string;
  schoolYearId: string;
  paymentType: string;
  dueDate: Date;
  status: "PENDING" | "PAID" | "OVERDUE";
  month: string;
  year: string;
  amount: number;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ListEnrollmentFinancialPlansUseCaseResponse {
  financialPlans: FinancialPlanItem[];
}

export class ListEnrollmentFinancialPlansUseCase {
  constructor(private businessUnitRepository: BusinessUnitRepository) {}

  async execute({
    businessUnitId,
    enrollmentId,
    schoolYearId,
    status,
  }: ListEnrollmentFinancialPlansUseCaseRequest): Promise<ListEnrollmentFinancialPlansUseCaseResponse> {
    const businessUnit =
      await this.businessUnitRepository.findById(businessUnitId);

    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        student: {
          business_unit_id: businessUnitId,
        },
      },
      select: { id: true },
    });

    if (!enrollment) {
      throw new ResourceNotFoundError("Enrollment not found");
    }

    const normalizedStatus = status && status !== "ALL" ? status : undefined;

    const plans = await prisma.financialPlan.findMany({
      where: {
        enrollment_id: enrollmentId,
        school_year_id: schoolYearId,
        status: normalizedStatus,
      },
      include: {
        payments: {
          orderBy: { paid_at: "desc" },
          take: 1,
          select: {
            amount: true,
            paid_at: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }, { due_date: "desc" }],
    });

    const financialPlans = plans.map((plan) => {
      const parsedDescription = this.parseDescription(plan.description);
      const latestPayment = plan.payments[0];
      const amount =
        latestPayment?.amount !== undefined
          ? Number(latestPayment.amount)
          : Number(parsedDescription.baseAmount ?? 0);

      return {
        id: plan.id,
        enrollmentId: plan.enrollment_id,
        schoolYearId: plan.school_year_id,
        paymentType: parsedDescription.paymentType ?? plan.name,
        dueDate: plan.due_date,
        status: plan.status,
        month: plan.month,
        year: plan.year,
        amount,
        paidAt: latestPayment?.paid_at ?? null,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
      };
    });

    return { financialPlans };
  }

  private parseDescription(description: string | null): {
    paymentType?: string;
    baseAmount?: number;
  } {
    if (!description) {
      return {};
    }

    try {
      const parsed = JSON.parse(description) as {
        paymentType?: string;
        baseAmount?: number;
      };

      return {
        paymentType: parsed.paymentType,
        baseAmount:
          typeof parsed.baseAmount === "number" ? parsed.baseAmount : undefined,
      };
    } catch {
      return {};
    }
  }
}
