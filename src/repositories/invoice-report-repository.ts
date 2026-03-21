import type {
  InvoiceType,
  PaymentMethod,
  SaleStatus,
} from "generated/prisma/enums";

export interface InvoiceReportCompanyData {
  legalName: string;
  tradeName: string;
  nif?: string | null;
  documentCodePrefix?: string | null;
  imageData?: string | null;
  imageType?: string | null;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  postalCode?: string | null;
}

export interface InvoiceReportBusinessUnitData {
  name: string;
  address: string;
}

export interface InvoiceReportCustomerData {
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  nif?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
}

export interface InvoiceReportItemData {
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  subtotal: number;
}

export interface InvoiceReportData {
  id: string;
  number: string;
  series: string;
  type: InvoiceType;
  issueDate: Date;
  taxableAmount: number;
  vatAmount: number;
  totalAmount: number;
  status: SaleStatus;
  pendingReason?: string | null;
  cancelReason?: string | null;
  paymentMethod?: PaymentMethod;
  company: InvoiceReportCompanyData;
  businessUnit: InvoiceReportBusinessUnitData;
  customer?: InvoiceReportCustomerData;
  items: InvoiceReportItemData[];
}

export interface InvoiceReportRepository {
  findByInvoiceId(invoiceId: string): Promise<InvoiceReportData | null>;
}
