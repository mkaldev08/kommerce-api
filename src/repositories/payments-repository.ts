import type { PaymentMethod } from '@/modules/store/domain/enums'

export interface PaymentData {
  id: string
  amount: number
  method: PaymentMethod
  paymentDate: Date
  invoiceId: string
  paymentType: string
}

export interface CreatePaymentInput {
  amount: number
  method: PaymentMethod
  paymentDate?: Date
  invoiceId: string
  paymentType: string
}

export interface PaymentsRepository {
  create(data: CreatePaymentInput): Promise<PaymentData>
  listByInvoiceId(invoiceId: string): Promise<PaymentData[]>
  getTotalPaidForInvoice(invoiceId: string): Promise<number>
  getCashTotalForRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<number>
}
