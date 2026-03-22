import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type { EnrollmentsRepository } from "@/repositories/enrollments-repository";
import type { InvoicesRepository } from "@/repositories/invoices-repository";
import type { PaymentsRepository } from "@/repositories/payments-repository";
import type { CashMovementsRepository } from "@/repositories/cash-movements-repository";
import { prisma } from "@/lib/prisma";
import { AcademyFinancialConfigMissingError } from "@/use-cases/errors/academy-financial-config-missing-error";
import { BusinessUnitNotAcademyError } from "@/use-cases/errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import {
  CashMovementType,
  InvoiceType,
  PaymentMethod,
  PaymentType,
  SaleStatus,
} from "generated/prisma/enums";

interface RegisterEnrollmentPaymentRequest {
  businessUnitId: string;
  enrollmentId: string;
  cashRegisterId: string;
  amount?: number;
  method: PaymentMethod;
  paymentType: PaymentType;
  paidAt?: Date;
}

interface RegisterEnrollmentPaymentResponse {
  invoiceId: string;
  paymentId: string;
}

interface ResolvedPaymentAmount {
  amount: number;
  financialPlanId: string | null;
}

export class RegisterEnrollmentPaymentUseCase {
  constructor(
    private businessUnitRepository: BusinessUnitRepository,
    private enrollmentsRepository: EnrollmentsRepository,
    private invoicesRepository: InvoicesRepository,
    private paymentsRepository: PaymentsRepository,
    private cashMovementsRepository: CashMovementsRepository,
  ) {}

  async execute(
    request: RegisterEnrollmentPaymentRequest,
  ): Promise<RegisterEnrollmentPaymentResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      request.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const enrollment = await this.enrollmentsRepository.findById(
      request.enrollmentId,
    );

    if (!enrollment || enrollment.businessUnitId !== request.businessUnitId) {
      throw new ResourceNotFoundError();
    }

    const paymentDate = request.paidAt ?? new Date();
    const resolvedPayment = await this.resolvePaymentAmount(
      request,
      paymentDate,
    );

    const invoice = await this.invoicesRepository.create({
      number: this.generateInvoiceNumber(),
      series: String(paymentDate.getFullYear()),
      type: InvoiceType.INVOICE_RECEIPT,
      issueDate: paymentDate,
      taxableAmount: resolvedPayment.amount,
      vatAmount: 0,
      totalAmount: resolvedPayment.amount,
      status: SaleStatus.COMPLETED,
      companyId: businessUnit.company_id,
      businessUnitId: request.businessUnitId,
      cashRegisterId: request.cashRegisterId,
      customerId: null,
    });

    const payment = await this.paymentsRepository.create({
      amount: resolvedPayment.amount,
      method: request.method,
      paymentDate,
      invoiceId: invoice.id,
      financialPlanId: resolvedPayment.financialPlanId,
      paymentType: request.paymentType,
    });

    if (resolvedPayment.financialPlanId) {
      await prisma.financialPlan.update({
        where: { id: resolvedPayment.financialPlanId },
        data: { status: "PAID" },
      });
    }

    if (request.method === PaymentMethod.CASH) {
      await this.cashMovementsRepository.create({
        cashRegisterId: request.cashRegisterId,
        type: CashMovementType.ENTRY,
        amount: resolvedPayment.amount,
        description: `Pagamento da inscrição ${enrollment.studentName}`,
        movementDate: paymentDate,
      });
    }

    return {
      invoiceId: invoice.id,
      paymentId: payment.id,
    };
  }

  private generateInvoiceNumber(): string {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
  }

  private async resolvePaymentAmount(
    request: RegisterEnrollmentPaymentRequest,
    paymentDate: Date,
  ): Promise<ResolvedPaymentAmount> {
    if (request.amount && request.amount > 0) {
      return {
        amount: request.amount,
        financialPlanId: null,
      };
    }

    const pendingPlan = await prisma.financialPlan.findFirst({
      where: {
        enrollment_id: request.enrollmentId,
        name: request.paymentType,
        status: "PENDING",
      },
      orderBy: { due_date: "asc" },
    });

    if (pendingPlan) {
      const metadata = this.parseFinancialPlanDescription(
        pendingPlan.description,
      );

      if (metadata.baseAmount > 0) {
        const isOverdue = this.shouldApplyFine({
          paymentType: request.paymentType,
          dueDate: pendingPlan.due_date,
          paymentDate,
        });
        const fineAmount = isOverdue
          ? (metadata.baseAmount * metadata.fineTax) / 100
          : 0;

        return {
          amount: Number((metadata.baseAmount + fineAmount).toFixed(2)),
          financialPlanId: pendingPlan.id,
        };
      }
    }

    const enrollmentBelt = await prisma.enrollmentBelt.findFirst({
      where: { enrollment_id: request.enrollmentId },
      orderBy: { created_at: "desc" },
    });

    if (!enrollmentBelt) {
      throw new AcademyFinancialConfigMissingError(
        "A inscrição não possui graduação vinculada para calcular a propina.",
      );
    }

    const tuitionFee = await prisma.tuitionFee.findFirst({
      where: { belt_id: enrollmentBelt.belt_id },
      orderBy: { created_at: "desc" },
    });

    if (!tuitionFee) {
      throw new AcademyFinancialConfigMissingError(
        "Defina a propina da graduação antes de registrar pagamentos.",
      );
    }

    switch (request.paymentType) {
      case PaymentType.TUITION_FEE:
        return {
          amount: Number(tuitionFee.fee),
          financialPlanId: pendingPlan?.id ?? null,
        };
      case PaymentType.ENROLLMENT_FEE:
        return {
          amount: Number(tuitionFee.enrollment_fee),
          financialPlanId: pendingPlan?.id ?? null,
        };
      case PaymentType.CONFIRMATION_FEE:
        return {
          amount: Number(tuitionFee.confirmation_fee),
          financialPlanId: pendingPlan?.id ?? null,
        };
      default:
        return {
          amount: Number(tuitionFee.fee),
          financialPlanId: pendingPlan?.id ?? null,
        };
    }
  }

  private parseFinancialPlanDescription(description: string | null): {
    baseAmount: number;
    fineTax: number;
  } {
    if (!description) {
      return { baseAmount: 0, fineTax: 0 };
    }

    try {
      const parsed = JSON.parse(description) as {
        baseAmount?: unknown;
        fineTax?: unknown;
      };

      const baseAmount = Number(parsed.baseAmount ?? 0);
      const fineTax = Number(parsed.fineTax ?? 0);

      return {
        baseAmount: Number.isFinite(baseAmount) ? baseAmount : 0,
        fineTax: Number.isFinite(fineTax) ? fineTax : 0,
      };
    } catch {
      return { baseAmount: 0, fineTax: 0 };
    }
  }

  private shouldApplyFine(input: {
    paymentType: PaymentType;
    dueDate: Date;
    paymentDate: Date;
  }): boolean {
    if (input.paymentType !== PaymentType.TUITION_FEE) {
      return input.paymentDate.getTime() > input.dueDate.getTime();
    }

    const graceLimit = new Date(
      input.dueDate.getFullYear(),
      input.dueDate.getMonth(),
      10,
      23,
      59,
      59,
      999,
    );

    return input.paymentDate.getTime() > graceLimit.getTime();
  }
}
