import type { InvoiceType } from '@/modules/store/domain/enums'

export interface InvoiceData {
  id: string
  number: string
  series: string
  type: InvoiceType
  issueDate: Date
  taxableAmount: number
  vatAmount: number
  companyId: string
  businessUnitId: string
  cashRegisterId: string
  customerId?: string | null
}

export interface CreateInvoiceInput {
  number: string
  series: string
  type: InvoiceType
  issueDate?: Date
  taxableAmount: number
  vatAmount: number
  companyId: string
  businessUnitId: string
  cashRegisterId: string
  customerId?: string | null
}

export interface InvoicesRepository {
  create(data: CreateInvoiceInput): Promise<InvoiceData>
  findById(id: string): Promise<InvoiceData | null>
  updateTotals(
    id: string,
    taxableAmount: number,
    vatAmount: number,
  ): Promise<void>
}
