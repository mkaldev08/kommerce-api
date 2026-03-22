import { prisma } from "@/lib/prisma";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ListRecentEnrollmentPaymentsUseCaseRequest {
  businessUnitId: string;
  search?: string;
  limit?: number;
}

export interface RecentEnrollmentPaymentItem {
  paymentId: string;
  invoiceId: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  className: string;
  schoolYearName: string;
  amount: number;
  method: "CASH" | "CARD" | "EXPRESS" | "BANK_TRANSFER";
  paymentType: "TUITION_FEE" | "ENROLLMENT_FEE" | "CONFIRMATION_FEE";
  paymentDate: Date;
  status: "PAID" | "PENDING" | "OVERDUE";
}

interface ListRecentEnrollmentPaymentsUseCaseResponse {
  payments: RecentEnrollmentPaymentItem[];
}

export class ListRecentEnrollmentPaymentsUseCase {
  constructor(private businessUnitRepository: BusinessUnitRepository) {}

  async execute({
    businessUnitId,
    search,
    limit = 50,
  }: ListRecentEnrollmentPaymentsUseCaseRequest): Promise<ListRecentEnrollmentPaymentsUseCaseResponse> {
    const businessUnit =
      await this.businessUnitRepository.findById(businessUnitId);

    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const normalizedLimit = Math.min(Math.max(limit, 1), 100);
    const normalizedSearch = search?.trim();

    const payments = await prisma.payment.findMany({
      where: {
        invoice: {
          business_unit_id: businessUnitId,
        },
        financial_plan_id: { not: null },
        ...(normalizedSearch
          ? {
              financial_plan: {
                enrollment: {
                  student: {
                    OR: [
                      {
                        first_name: {
                          contains: normalizedSearch,
                          mode: "insensitive",
                        },
                      },
                      {
                        last_name: {
                          contains: normalizedSearch,
                          mode: "insensitive",
                        },
                      },
                      {
                        student_number: {
                          contains: normalizedSearch,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                },
              },
            }
          : {}),
      },
      include: {
        invoice: {
          select: {
            id: true,
          },
        },
        financial_plan: {
          include: {
            enrollment: {
              include: {
                student: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    student_number: true,
                  },
                },
                class: {
                  include: {
                    school_year: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { payment_date: "desc" },
      take: normalizedLimit,
    });

    return {
      payments: payments
        .filter((payment) => payment.financial_plan)
        .map((payment) => {
          const financialPlan = payment.financial_plan!;
          const enrollment = financialPlan.enrollment;
          const student = enrollment.student;

          return {
            paymentId: payment.id,
            invoiceId: payment.invoice.id,
            enrollmentId: enrollment.id,
            studentId: student.id,
            studentName: `${student.first_name} ${student.last_name}`.trim(),
            studentNumber: student.student_number,
            className: enrollment.class.name,
            schoolYearName: enrollment.class.school_year.name,
            amount: Number(payment.amount),
            method: payment.method,
            paymentType: payment.payment_type,
            paymentDate: payment.payment_date,
            status: financialPlan.status,
          };
        }),
    };
  }
}
