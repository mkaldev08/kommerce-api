import { uuidv7 } from 'uuidv7'
import type {
  CreateInvoiceInput,
  InvoiceData,
  InvoicesRepository,
} from '@/modules/store/application/ports/repositories/invoices-repository'

export class InMemoryInvoicesRepository implements InvoicesRepository {
  items: InvoiceData[] = []

  async create(data: CreateInvoiceInput): Promise<InvoiceData> {
    const invoice: InvoiceData = {
      id: uuidv7(),
      number: data.number,
      series: data.series,
      type: data.type,
      issueDate: data.issueDate ?? new Date(),
      taxableAmount: data.taxableAmount,
      vatAmount: data.vatAmount,
      companyId: data.companyId,
      businessUnitId: data.businessUnitId,
      cashRegisterId: data.cashRegisterId,
      customerId: data.customerId ?? null,
    }

    this.items.push(invoice)

    return invoice
  }

  async findById(id: string): Promise<InvoiceData | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async updateTotals(id: string, taxableAmount: number, vatAmount: number) {
    const index = this.items.findIndex((item) => item.id === id)

    if (index === -1) {
      throw new Error('Invoice not found')
    }

    this.items[index] = {
      ...this.items[index],
      taxableAmount,
      vatAmount,
    }
  }
}
