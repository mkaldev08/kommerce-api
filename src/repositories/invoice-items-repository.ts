import type { VATStatus } from '@/modules/store/domain/enums'

export interface CreateInvoiceItemInput {
  invoiceId: string
  productId: string
  quantity: number
  unitPrice: number
  vatRate: number
  vatAmount: number
  subtotal: number
  vatStatus: VATStatus
}

export interface InvoiceItemsRepository {
  createMany(items: CreateInvoiceItemInput[]): Promise<void>
}
