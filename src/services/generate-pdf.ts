import puppeteer, { type PDFOptions } from "puppeteer";
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

export class PuppeteerInvoicePdfGenerator implements InvoicePdfGenerator {
  async generate(data: InvoiceReportData): Promise<Buffer> {
    const html = renderInvoiceTemplate({
      companyName: data.company.tradeName || data.company.legalName,
      customerName: data.customer?.name ?? "Consumidor Final",
      invoiceNumber: `${data.number}/${data.series}`,
      date: DATE_FORMATTER.format(data.issueDate),
      items: data.items.map((item) => ({
        description: item.productName,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      total: data.totalAmount,
    });

    return generatePdf(html, { format: "A4" });
  }
}
