import type { GamingSessionPayment } from "generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
    CreateGamingSessionPaymentInput,
    GamingSessionPaymentData,
    GamingSessionPaymentsRepository,
} from "../gaming-session-payments-repository";

export class PrismaGamingSessionPaymentsRepository
  implements GamingSessionPaymentsRepository
{
  async create(
    data: CreateGamingSessionPaymentInput,
  ): Promise<GamingSessionPaymentData> {
    const payment = await prisma.gamingSessionPayment.create({
      data: {
        session_id: data.sessionId,
        amount: data.amount,
        method: data.method,
        payment_date: data.paymentDate || new Date(),
      },
    });

    return this.toPaymentData(payment);
  }

  async findManyBySessionId(sessionId: string): Promise<GamingSessionPaymentData[]> {
    const payments = await prisma.gamingSessionPayment.findMany({
      where: { session_id: sessionId },
      orderBy: { payment_date: "desc" },
    });

    return payments.map((payment) => this.toPaymentData(payment));
  }

  async getTotalPaidBySessionId(sessionId: string): Promise<number> {
    const result = await prisma.gamingSessionPayment.aggregate({
      where: { session_id: sessionId },
      _sum: { amount: true },
    });

    return Number(result._sum.amount || 0);
  }

  private toPaymentData(payment: GamingSessionPayment): GamingSessionPaymentData {
    return {
      id: payment.id,
      sessionId: payment.session_id,
      amount: Number(payment.amount),
      method: payment.method,
      paymentDate: payment.payment_date,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at,
    };
  }
}
