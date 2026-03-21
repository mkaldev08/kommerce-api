import type { InvoiceReportRepository } from "@/repositories/invoice-report-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import type { InvoicePdfGenerator } from "@/use-cases/services/invoice-pdf-generator";

interface ExportInvoicePdfUseCaseRequest {
  invoiceId: string;
}

interface ExportInvoicePdfUseCaseResponse {
  fileName: string;
  fileContent: Buffer;
}

const sanitizeFileNamePart = (value: string): string =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9-_.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export class ExportInvoicePdfUseCase {
  constructor(
    private invoiceReportRepository: InvoiceReportRepository,
    private invoicePdfGenerator: InvoicePdfGenerator,
  ) {}

  async execute(
    request: ExportInvoicePdfUseCaseRequest,
  ): Promise<ExportInvoicePdfUseCaseResponse> {
    const invoiceReport = await this.invoiceReportRepository.findByInvoiceId(
      request.invoiceId,
    );

    if (!invoiceReport) {
      throw new ResourceNotFoundError();
    }

    const fileContent = await this.invoicePdfGenerator.generate(invoiceReport);
    const number = sanitizeFileNamePart(invoiceReport.number);
    const series = sanitizeFileNamePart(invoiceReport.series);
    const documentCode = sanitizeFileNamePart(
      invoiceReport.company.documentCode,
    );
    const documentIdentifier = `${documentCode}${series}-${number}`;

    return {
      fileName: `invoice-${documentIdentifier}.pdf`,
      fileContent,
    };
  }
}
