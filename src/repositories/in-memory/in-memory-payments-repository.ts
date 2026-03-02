import { uuidv7 } from 'uuidv7'
import type { InvoicesRepository } from '@/modules/store/application/ports/repositories/invoices-repository'
import type {
  CreatePaymentInput,
  PaymentData,
  PaymentsRepository,
} from '@/modules/store/application/ports/repositories/payments-repository'

export class InMemoryPaymentsRepository implements PaymentsRepository {
  items: PaymentData[] = []

  constructor(private readonly invoicesRepository: InvoicesRepository) {}

  async create(data: CreatePaymentInput): Promise<PaymentData> {
    const payment: PaymentData = {
      id: uuidv7(),
      amount: data.amount,
      method: data.method,
      paymentDate: data.paymentDate ?? new Date(),
      invoiceId: data.invoiceId,
      paymentType: data.paymentType,
    }

    this.items.push(payment)

    return payment
  }

  async listByInvoiceId(invoiceId: string): Promise<PaymentData[]> {
    return this.items.filter((item) => item.invoiceId === invoiceId)
  }

  async getTotalPaidForInvoice(invoiceId: string): Promise<number> {
    return this.items
      .filter((item) => item.invoiceId === invoiceId)
      .reduce((total, item) => total + item.amount, 0)
  }

  async getCashTotalForRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<number> {
    const invoices = await Promise.all(
      this.items
        .filter((item) => item.method === 'CASH')
        .filter((item) => item.paymentDate >= from && item.paymentDate <= to)
        .map(async (item) => {
          const invoice = await this.invoicesRepository.findById(item.invoiceId)
          return invoice?.cashRegisterId === cashRegisterId ? item : null
        }),
    )

    return invoices
      .filter((item): item is PaymentData => item !== null)
      .reduce((total, item) => total + item.amount, 0)
  }
}
