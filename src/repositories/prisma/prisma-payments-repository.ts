import { PaymentMethod, PaymentType } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
  CreatePaymentInput,
  PaymentData,
  PaymentsRepository,
} from "../payments-repository";

export class PrismaPaymentsRepository implements PaymentsRepository {
  async create(data: CreatePaymentInput): Promise<PaymentData> {
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        method: data.method as keyof typeof PaymentMethod,
        payment_date: data.paymentDate || new Date(),
        invoice_id: data.invoiceId,
        financial_plan_id: data.financialPlanId ?? null,
        payment_type: data.paymentType as keyof typeof PaymentType,
      },
    });

    return {
      id: payment.id,
      amount: Number(payment.amount),
      method: payment.method,
      paymentDate: payment.payment_date,
      invoiceId: payment.invoice_id,
      financialPlanId: payment.financial_plan_id,
      paymentType: payment.payment_type,
    };
  }

  async listByInvoiceId(invoiceId: string): Promise<PaymentData[]> {
    const payments = await prisma.payment.findMany({
      where: { invoice_id: invoiceId },
    });

    return payments.map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount),
      method: payment.method,
      paymentDate: payment.payment_date,
      invoiceId: payment.invoice_id,
      financialPlanId: payment.financial_plan_id,
      paymentType: payment.payment_type,
    }));
  }

  async getTotalPaidForInvoice(invoiceId: string): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: { invoice_id: invoiceId },
      _sum: { amount: true },
    });

    return Number(result._sum.amount || 0);
  }

  async getCashTotalForRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: {
        method: PaymentMethod.CASH,
        payment_date: {
          gte: from,
          lte: to,
        },
        invoice: {
          cash_register_id: cashRegisterId,
        },
      },
      _sum: { amount: true },
    });

    return Number(result._sum?.amount || 0);
  }
}
