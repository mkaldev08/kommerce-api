import puppeteer, { type PDFOptions } from "puppeteer";
import QRCode from "qrcode";
import type { InvoiceReportData } from "@/repositories/invoice-report-repository";
import { renderInvoiceTemplate } from "@/templates/invoice-template";
import type { InvoicePdfGenerator } from "@/use-cases/services/invoice-pdf-generator";

export type PdfPaperFormat = "A4" | "POS_80MM";

export interface GeneratePdfOptions {
  format?: PdfPaperFormat;
}

export async function generatePdf(
  html: string,
  options: GeneratePdfOptions = {},
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const selectedFormat = options.format ?? "A4";

    const pdfOptions: PDFOptions =
      selectedFormat === "POS_80MM"
        ? {
            printBackground: true,
            width: "80mm",
            margin: {
              top: "2mm",
              right: "2mm",
              bottom: "2mm",
              left: "2mm",
            },
          }
        : {
            format: "A4",
            printBackground: true,
            margin: {
              top: "10mm",
              right: "10mm",
              bottom: "10mm",
              left: "10mm",
            },
          };

    const pdf = await page.pdf(pdfOptions);
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeZone: "Africa/Luanda",
});

const INVOICE_TYPE_LABEL: Record<InvoiceReportData["type"], string> = {
  INVOICE: "Fatura",
  INVOICE_RECEIPT: "Fatura Recibo",
  CREDIT_NOTE: "Nota de Crédito",
  DEBIT_NOTE: "Nota de Débito",
};

const INVOICE_TYPE_CODE: Record<InvoiceReportData["type"], string> = {
  INVOICE: "FT",
  INVOICE_RECEIPT: "FR",
  CREDIT_NOTE: "NC",
  DEBIT_NOTE: "ND",
};

const PAYMENT_METHOD_LABEL: Partial<
  Record<NonNullable<InvoiceReportData["paymentMethod"]>, string>
> = {
  CASH: "Dinheiro",
  CARD: "Cartão",
  EXPRESS: "Express",
  BANK_TRANSFER: "Transferência",
};

const formatDocumentIdentifier = (data: InvoiceReportData): string => {
  const documentCode = data.company.documentCode.trim();
  const series = data.series.trim();
  const number = data.number.trim();

  return `${documentCode}${series}/${number}`;
};

const buildQrCodePayload = (data: InvoiceReportData): string => {
  const customer = data.customer?.name ?? "Consumidor Final";
  const nif = data.customer?.nif ?? "999999999";
  const total = data.totalAmount.toFixed(2);
  const documentIdentifier = formatDocumentIdentifier(data);

  return [
    `DOC=${INVOICE_TYPE_CODE[data.type]} ${documentIdentifier}`,
    `DATA=${DATE_FORMATTER.format(data.issueDate)}`,
    `EMITENTE=${data.company.tradeName || data.company.legalName}`,
    `NIF=${data.company.nif}`,
    `CLIENTE=${customer}`,
    `NIF_CLIENTE=${nif}`,
    `TOTAL_AOA=${total}`,
  ].join("\n");
};

export class PuppeteerInvoicePdfGenerator implements InvoicePdfGenerator {
  async generate(data: InvoiceReportData): Promise<Buffer> {
    const documentIdentifier = formatDocumentIdentifier(data);

    const qrCodeDataUrl = await QRCode.toDataURL(buildQrCodePayload(data), {
      errorCorrectionLevel: "M",
      margin: 0,
      width: 220,
    });

    const html = renderInvoiceTemplate({
      typeLabel: INVOICE_TYPE_LABEL[data.type],
      typeCode: INVOICE_TYPE_CODE[data.type],
      companyName: data.company.tradeName || data.company.legalName,
      companyAddress: data.company.streetAddress,
      companyPhone: data.company.phoneNumber,
      companyEmail: data.company.email,
      companyDocumentCode: data.company.documentCode,
      customerName: data.customer?.name ?? "Consumidor Final",
      customerAddress: data.customer?.streetAddress ?? "Sem morada",
      customerNif: data.customer?.nif ?? "999999999",
      invoiceNumber: documentIdentifier,
      date: DATE_FORMATTER.format(data.issueDate),
      paymentMethod: data.paymentMethod
        ? (PAYMENT_METHOD_LABEL[data.paymentMethod] ?? data.paymentMethod)
        : "Não informado",
      items: data.items.map((item) => ({
        code: item.productCode,
        description: item.productName,
        quantity: item.quantity,
        unit: "Un",
        unitPrice: item.unitPrice,
        discountRate: 0,
        vatRate: item.vatRate,
        total: item.subtotal,
      })),
      taxableAmount: data.taxableAmount,
      vatAmount: data.vatAmount,
      total: data.totalAmount,
      qrCodeDataUrl,
    });

    return generatePdf(html, { format: "A4" });
  }
}
