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

const INVOICE_TYPE_FILE_LABEL: Record<string, string> = {
  INVOICE: "Fatura",
  INVOICE_RECEIPT: "Fatura_Recibo",
  CREDIT_NOTE: "Nota_de_Credito",
  DEBIT_NOTE: "Nota_de_Debito",
};

const sanitizeFileNamePart = (value: string): string =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9-_.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const sanitizeOptionalFileNamePart = (
  value: string | null | undefined,
  fallback: string,
): string => {
  if (!value) {
    return fallback;
  }

  const sanitized = sanitizeFileNamePart(value);
  return sanitized || fallback;
};

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
    const invoiceTypeLabel = sanitizeOptionalFileNamePart(
      INVOICE_TYPE_FILE_LABEL[invoiceReport.type] ?? invoiceReport.type,
      "Fatura",
    );
    const customerName = sanitizeOptionalFileNamePart(
      invoiceReport.customer?.name,
      "Consumidor_Final",
    );
    const timestamp = Date.now();

    return {
      fileName: `${invoiceTypeLabel}-${customerName}-${timestamp}.pdf`,
      fileContent,
    };
  }
}
