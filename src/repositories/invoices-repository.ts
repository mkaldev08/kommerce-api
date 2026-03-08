import { InvoiceType, SaleStatus } from "generated/prisma/enums";

export interface InvoiceData {
  id: string;
  number: string;
  series: string;
  type: InvoiceType; // InvoiceType: INVOICE | INVOICE_RECEIPT | CREDIT_NOTE | DEBIT_NOTE
  issueDate: Date;
  taxableAmount: number;
  vatAmount: number;
  totalAmount: number;
  status: SaleStatus;
  pendingReason?: string | null;
  cancelReason?: string | null;
  companyId: string;
  businessUnitId: string;
  cashRegisterId: string;
  customerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceInput {
  number: string;
  series: string;
  type: InvoiceType; // InvoiceType: INVOICE | INVOICE_RECEIPT | CREDIT_NOTE | DEBIT_NOTE
  issueDate?: Date;
  taxableAmount: number;
  vatAmount: number;
  totalAmount: number;
  status?: SaleStatus; // SaleStatus: CONCLUIDA | PENDENTE | CANCELADA
  companyId: string;
  businessUnitId: string;
  cashRegisterId: string;
  customerId?: string | null;
}

export interface InvoicesRepository {
  create(data: CreateInvoiceInput): Promise<InvoiceData>;
  findById(id: string): Promise<InvoiceData | null>;
  findByBusinessUnitId(businessUnitId: string): Promise<InvoiceData[]>;
  updateTotals(
    id: string,
    taxableAmount: number,
    vatAmount: number,
    totalAmount: number,
  ): Promise<void>;
  updateStatus(id: string, status: SaleStatus, reason?: string): Promise<void>;
}
