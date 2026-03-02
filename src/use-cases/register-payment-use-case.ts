import type { PaymentMethod } from '@/modules/store/domain/enums'
import { InvoiceNotFoundError } from '../errors/invoice-not-found-error'
import { PaymentExceedsTotalError } from '../errors/payment-exceeds-total-error'
import type { InvoicesRepository } from '../ports/repositories/invoices-repository'
import type { PaymentsRepository } from '../ports/repositories/payments-repository'
import { err, ok, type Result } from '../result'

interface RegisterPaymentRequest {
  invoiceId: string
  payments: Array<{
    amount: number
    method: PaymentMethod
    paymentType?: string
  }>
}

interface RegisterPaymentResponse {
  outstandingAmount: number
}

export class RegisterPaymentUseCase {
  constructor(
    private invoicesRepository: InvoicesRepository,
    private paymentsRepository: PaymentsRepository,
  ) {}

  async execute(
    request: RegisterPaymentRequest,
  ): Promise<Result<RegisterPaymentResponse, Error>> {
    const invoice = await this.invoicesRepository.findById(request.invoiceId)

    if (!invoice) {
      return err(new InvoiceNotFoundError())
    }

    const total = invoice.taxableAmount + invoice.vatAmount
    let paid = await this.paymentsRepository.getTotalPaidForInvoice(invoice.id)

    for (const payment of request.payments) {
      const outstanding = total - paid

      if (payment.amount > outstanding) {
        return err(new PaymentExceedsTotalError())
      }

      await this.paymentsRepository.create({
        invoiceId: invoice.id,
        amount: payment.amount,
        method: payment.method,
        paymentType: payment.paymentType ?? 'TUITION_FEE',
      })

      paid += payment.amount
    }

    return ok({ outstandingAmount: Math.max(total - paid, 0) })
  }
}
