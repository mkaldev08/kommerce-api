import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type { EnrollmentsRepository } from "@/repositories/enrollments-repository";
import type { InvoicesRepository } from "@/repositories/invoices-repository";
import type { PaymentsRepository } from "@/repositories/payments-repository";
import type { CashMovementsRepository } from "@/repositories/cash-movements-repository";
import { prisma } from "@/lib/prisma";
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

    const resolvedAmount = await this.resolvePaymentAmount(request);
    const paymentDate = request.paidAt ?? new Date();

    const invoice = await this.invoicesRepository.create({
      number: this.generateInvoiceNumber(),
      series: String(paymentDate.getFullYear()),
      type: InvoiceType.INVOICE_RECEIPT,
      issueDate: paymentDate,
      taxableAmount: resolvedAmount,
      vatAmount: 0,
      totalAmount: resolvedAmount,
      status: SaleStatus.COMPLETED,
      companyId: businessUnit.company_id,
      businessUnitId: request.businessUnitId,
      cashRegisterId: request.cashRegisterId,
      customerId: null,
    });

    const payment = await this.paymentsRepository.create({
      amount: resolvedAmount,
      method: request.method,
      paymentDate,
      invoiceId: invoice.id,
      paymentType: request.paymentType,
    });

    if (request.method === PaymentMethod.CASH) {
      await this.cashMovementsRepository.create({
        cashRegisterId: request.cashRegisterId,
        type: CashMovementType.ENTRY,
        amount: resolvedAmount,
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
  ): Promise<number> {
    if (request.amount && request.amount > 0) {
      return request.amount;
    }

    const enrollmentBelt = await prisma.enrollmentBelt.findFirst({
      where: { enrollment_id: request.enrollmentId },
      orderBy: { created_at: "desc" },
    });

    if (!enrollmentBelt) {
      throw new ResourceNotFoundError(
        "Não foi possível calcular o valor automático: inscrição sem faixa atribuída.",
      );
    }

    const tuitionFee = await prisma.tuitionFee.findFirst({
      where: { belt_id: enrollmentBelt.belt_id },
      orderBy: { created_at: "desc" },
    });

    if (!tuitionFee) {
      throw new ResourceNotFoundError(
        "Não foi possível calcular o valor automático: tabela de propinas não configurada para esta faixa.",
      );
    }

    switch (request.paymentType) {
      case PaymentType.TUITION_FEE:
        return Number(tuitionFee.fee);
      case PaymentType.ENROLLMENT_FEE:
        return Number(tuitionFee.enrollment_fee);
      case PaymentType.CONFIRMATION_FEE:
        return Number(tuitionFee.confirmation_fee);
      default:
        return Number(tuitionFee.fee);
    }
  }
}
