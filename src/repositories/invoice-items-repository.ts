import { VATStatus } from "generated/prisma/enums";

export interface CreateInvoiceItemInput {
  invoiceId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  subtotal: number;
  vatStatus: VATStatus; // VATStatus: TAXED | EXEMPT | NOT_SUBJECT
}

export interface InvoiceItemData {
  id: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  subtotal: number;
  vatStatus: VATStatus;
  invoiceId: string;
  productId: string;
}

export interface InvoiceItemsRepository {
  createMany(items: CreateInvoiceItemInput[]): Promise<void>;
  findByInvoiceId(invoiceId: string): Promise<InvoiceItemData[]>;
}
