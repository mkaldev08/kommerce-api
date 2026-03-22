import type {
  CreateEnrollmentInput,
  CreateEnrollmentPersistenceInput,
  EnrollmentData,
  EnrollmentsRepository,
} from "@/repositories/enrollments-repository";
import type { StudentsRepository } from "@/repositories/students-repository";
import type { ClassesRepository } from "@/repositories/classes-repository";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import { prisma } from "@/lib/prisma";
import { FinancialPlanStatus, PaymentType } from "generated/prisma/enums";
import { AcademyFinancialConfigMissingError } from "./errors/academy-financial-config-missing-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";

interface CreateEnrollmentUseCaseResponse {
  enrollment: EnrollmentData;
}

export class CreateEnrollmentUseCase {
  constructor(
    private enrollmentsRepository: EnrollmentsRepository,
    private studentsRepository: StudentsRepository,
    private classesRepository: ClassesRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    input: CreateEnrollmentInput,
  ): Promise<CreateEnrollmentUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      input.businessUnitId,
    );
    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }
    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const student = await this.studentsRepository.findById(input.studentId);
    if (!student) {
      throw new ResourceNotFoundError();
    }

    const cls = await this.classesRepository.findById(input.classId);
    if (!cls) {
      throw new ResourceNotFoundError();
    }

    const classWithSchoolYear = await prisma.class.findUnique({
      where: { id: input.classId },
      include: {
        school_year: {
          select: {
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    if (!classWithSchoolYear) {
      throw new ResourceNotFoundError();
    }

    const belt = await prisma.belt.findUnique({ where: { id: input.beltId } });
    if (!belt) {
      throw new ResourceNotFoundError();
    }

    const enrollmentCreateInput: CreateEnrollmentPersistenceInput = {
      ...input,
      startDate: new Date(classWithSchoolYear.school_year.start_date),
      endDate: new Date(classWithSchoolYear.school_year.end_date),
    };

    const enrollment = await this.enrollmentsRepository.create(
      enrollmentCreateInput,
    );

    await prisma.enrollmentBelt.create({
      data: {
        enrollment_id: enrollment.id,
        belt_id: input.beltId,
      },
    });

    await this.generateFinancialPlanForEnrollment(
      enrollment,
      enrollmentCreateInput,
      businessUnit.company_id,
    );

    return { enrollment };
  }

  private async generateFinancialPlanForEnrollment(
    enrollment: EnrollmentData,
    input: CreateEnrollmentInput,
    companyId: string,
  ): Promise<void> {
    const cls = await prisma.class.findUnique({
      where: { id: input.classId },
      include: {
        school_year: {
          select: {
            id: true,
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    if (!cls) {
      throw new ResourceNotFoundError();
    }

    const tuitionFee = await prisma.tuitionFee.findFirst({
      where: { belt_id: input.beltId },
      orderBy: { created_at: "desc" },
    });

    if (!tuitionFee) {
      throw new AcademyFinancialConfigMissingError(
        "Defina a propina da graduação selecionada antes de criar a inscrição.",
      );
    }

    const monthDueDay = tuitionFee.due_date.getDate();
    const fineTax = Number(tuitionFee.fine_tax ?? 0);
    const enrollmentStart = new Date(input.startDate);
    const schoolYearStart = new Date(cls.school_year.start_date);
    const schoolYearEnd = new Date(cls.school_year.end_date);
    const enrollmentEnd = input.endDate ? new Date(input.endDate) : null;

    const planStart =
      enrollmentStart > schoolYearStart ? enrollmentStart : schoolYearStart;
    const planEnd =
      enrollmentEnd && enrollmentEnd < schoolYearEnd
        ? enrollmentEnd
        : schoolYearEnd;

    const planRows: Array<{
      name: string;
      description: string;
      school_year_id: string;
      enrollment_id: string;
      company_id: string;
      month: string;
      year: string;
      due_date: Date;
      status: FinancialPlanStatus;
    }> = [];

    const appendPlanRow = (
      paymentType: PaymentType,
      dueDate: Date,
      baseAmount: number,
      referenceDate: Date = dueDate,
    ): void => {
      planRows.push({
        name: paymentType,
        description: JSON.stringify({
          paymentType,
          baseAmount,
          fineTax,
          beltId: input.beltId,
          referenceMonth: referenceDate.getMonth() + 1,
          referenceYear: referenceDate.getFullYear(),
        }),
        school_year_id: cls.school_year.id,
        enrollment_id: enrollment.id,
        company_id: companyId,
        month: String(referenceDate.getMonth() + 1).padStart(2, "0"),
        year: String(referenceDate.getFullYear()),
        due_date: dueDate,
        status: FinancialPlanStatus.PENDING,
      });
    };

    appendPlanRow(
      PaymentType.ENROLLMENT_FEE,
      planStart,
      Number(tuitionFee.enrollment_fee),
    );
    appendPlanRow(
      PaymentType.CONFIRMATION_FEE,
      planStart,
      Number(tuitionFee.confirmation_fee),
    );

    let cursor = new Date(planStart.getFullYear(), planStart.getMonth(), 1);
    const endMonth = new Date(planEnd.getFullYear(), planEnd.getMonth(), 1);

    while (cursor <= endMonth) {
      const dueReference = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 1,
        1,
      );
      const daysInMonth = new Date(
        dueReference.getFullYear(),
        dueReference.getMonth() + 1,
        0,
      ).getDate();
      const normalizedDueDay = Math.min(Math.max(monthDueDay, 1), daysInMonth);
      const dueDate = new Date(
        dueReference.getFullYear(),
        dueReference.getMonth(),
        normalizedDueDay,
      );

      if (
        cursor >= new Date(planStart.getFullYear(), planStart.getMonth(), 1) &&
        cursor <= endMonth
      ) {
        appendPlanRow(
          PaymentType.TUITION_FEE,
          dueDate,
          Number(tuitionFee.fee),
          cursor,
        );
      }

      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    if (planRows.length > 0) {
      await prisma.financialPlan.createMany({ data: planRows });
    }
  }
}
