import type { PaymentMethod } from "generated/prisma/enums";

export interface GamingSessionPaymentData {
  id: string;
  sessionId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGamingSessionPaymentInput {
  sessionId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate?: Date;
}

export interface GamingSessionPaymentsRepository {
  create(data: CreateGamingSessionPaymentInput): Promise<GamingSessionPaymentData>;
  findManyBySessionId(sessionId: string): Promise<GamingSessionPaymentData[]>;
  getTotalPaidBySessionId(sessionId: string): Promise<number>;
}
