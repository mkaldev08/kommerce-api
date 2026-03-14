import type { InvoiceReportData } from "@/repositories/invoice-report-repository";

export interface InvoicePdfGenerator {
  generate(data: InvoiceReportData): Promise<Buffer>;
}
