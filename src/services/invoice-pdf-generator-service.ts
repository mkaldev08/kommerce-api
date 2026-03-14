import type { InvoiceReportData } from "@/repositories/invoice-report-repository";
import { PuppeteerInvoicePdfGenerator } from "@/services/generate-pdf";
import type { InvoicePdfGenerator } from "@/use-cases/services/invoice-pdf-generator";

export class InvoicePdfGeneratorService implements InvoicePdfGenerator {
  private readonly delegate = new PuppeteerInvoicePdfGenerator();

  async generate(data: InvoiceReportData): Promise<Buffer> {
    return this.delegate.generate(data);
  }
}
