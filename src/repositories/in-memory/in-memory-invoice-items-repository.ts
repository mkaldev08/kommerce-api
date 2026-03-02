import type {
  CreateInvoiceItemInput,
  InvoiceItemsRepository,
} from '@/modules/store/application/ports/repositories/invoice-items-repository'

export class InMemoryInvoiceItemsRepository implements InvoiceItemsRepository {
  items: CreateInvoiceItemInput[] = []

  async createMany(items: CreateInvoiceItemInput[]): Promise<void> {
    this.items.push(...items)
  }
}
