export interface PaymentData {
  id: string;
  amount: number;
  method: string; // PaymentMethod
  paymentDate: Date;
  invoiceId: string;
  financialPlanId?: string | null;
  paymentType: string;
}

export interface CreatePaymentInput {
  amount: number;
  method: string; // PaymentMethod
  paymentDate?: Date;
  invoiceId: string;
  financialPlanId?: string | null;
  paymentType: string;
}

export interface PaymentsRepository {
  create(data: CreatePaymentInput): Promise<PaymentData>;
  listByInvoiceId(invoiceId: string): Promise<PaymentData[]>;
  getTotalPaidForInvoice(invoiceId: string): Promise<number>;
  getCashTotalForRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<number>;
}
