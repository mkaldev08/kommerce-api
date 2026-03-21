import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export interface InvoiceTemplateItem {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountRate: number;
  vatRate: number;
  total: number;
}

export interface InvoiceTemplateData {
  typeLabel: string;
  typeCode: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyDocumentCode: string;
  customerName: string;
  customerAddress: string;
  customerNif: string;
  invoiceNumber: string;
  date: string;
  paymentMethod: string;
  items: InvoiceTemplateItem[];
  taxableAmount: number;
  vatAmount: number;
  total: number;
  qrCodeDataUrl?: string;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-PT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PERCENT_FORMATTER = new Intl.NumberFormat("pt-PT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const FRONTEND_ROOT = path.resolve(process.cwd(), "../kommerce-app");

const resolveCssFromAssetsDirectory = (
  assetsDirPath: string,
): string | null => {
  if (!existsSync(assetsDirPath)) {
    return null;
  }

  const cssFileName = readdirSync(assetsDirPath).find((fileName) =>
    fileName.endsWith(".css"),
  );

  if (!cssFileName) {
    return null;
  }

  return path.join(assetsDirPath, cssFileName);
};

const resolveTailwindCssPath = (): string | null => {
  const configuredCssPath = process.env.FRONTEND_CSS_PATH;
  if (configuredCssPath && existsSync(configuredCssPath)) {
    return configuredCssPath;
  }

  const directCssCandidates = [
    path.join(FRONTEND_ROOT, "dist/assets/index.css"),
    path.join(FRONTEND_ROOT, "build/assets/index.css"),
  ];

  const directCss = directCssCandidates.find((candidate) =>
    existsSync(candidate),
  );
  if (directCss) {
    return directCss;
  }

  const assetsCandidates = [
    path.join(FRONTEND_ROOT, "dist/assets"),
    path.join(FRONTEND_ROOT, "build/assets"),
  ];

  for (const assetsCandidate of assetsCandidates) {
    const cssPath = resolveCssFromAssetsDirectory(assetsCandidate);
    if (cssPath) {
      return cssPath;
    }
  }

  return null;
};

const loadTailwindCss = (): string => {
  const cssPath = resolveTailwindCssPath();
  if (!cssPath) {
    return "";
  }

  return readFileSync(cssPath, "utf-8");
};

export function renderInvoiceTemplate(data: InvoiceTemplateData): string {
  const tailwindCss = loadTailwindCss();

  const safeTypeLabel = escapeHtml(data.typeLabel);
  const safeTypeCode = escapeHtml(data.typeCode);
  const safeCompanyName = escapeHtml(data.companyName);
  const safeCompanyAddress = escapeHtml(data.companyAddress);
  const safeCompanyPhone = escapeHtml(data.companyPhone);
  const safeCompanyEmail = escapeHtml(data.companyEmail);
  const safeCompanyDocumentCode = escapeHtml(data.companyDocumentCode);
  const safeCustomerName = escapeHtml(data.customerName);
  const safeCustomerAddress = escapeHtml(data.customerAddress);
  const safeCustomerNif = escapeHtml(data.customerNif);
  const safeInvoiceNumber = escapeHtml(data.invoiceNumber);
  const safeDate = escapeHtml(data.date);
  const safePaymentMethod = escapeHtml(data.paymentMethod);
  const safeQrCodeDataUrl = data.qrCodeDataUrl
    ? escapeHtml(data.qrCodeDataUrl)
    : "";

  const rows = data.items
    .map((item) => {
      const safeCode = escapeHtml(item.code);
      const safeDescription = escapeHtml(item.description);
      const safeUnit = escapeHtml(item.unit);
      const quantity = PERCENT_FORMATTER.format(item.quantity);
      const unitPrice = CURRENCY_FORMATTER.format(item.unitPrice);
      const discount = `${PERCENT_FORMATTER.format(item.discountRate)}%`;
      const vatRate = `${PERCENT_FORMATTER.format(item.vatRate)}%`;
      const lineTotal = CURRENCY_FORMATTER.format(item.total);

      return `
        <tr>
          <td>${safeCode}</td>
          <td>${safeDescription}</td>
          <td class="text-right">${quantity}</td>
          <td class="text-center">${safeUnit}</td>
          <td class="text-right">${unitPrice}</td>
          <td class="text-right">${discount}</td>
          <td class="text-right">${vatRate}</td>
          <td class="text-right">${lineTotal}</td>
          <td class="text-right">${lineTotal}</td>
        </tr>
      `;
    })
    .join("");

  const total = CURRENCY_FORMATTER.format(data.total);
  const taxableAmount = CURRENCY_FORMATTER.format(data.taxableAmount);
  const vatAmount = CURRENCY_FORMATTER.format(data.vatAmount);

  return `
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fatura ${safeInvoiceNumber}</title>
        <style>
          ${tailwindCss}

          @page {
            size: A4;
            margin: 6mm;
          }

             * {
            box-sizing: border-box;
          }

          html,
          body {
            width: 100%;
            min-height: 100%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            font-size: 12px;
          }
          .sheet {
            width: 100%;
            border: 1px solid #b4b4b4;
            padding: 12px;
          }

          .row {
            width: 100%;
            display: table;
            table-layout: fixed;
          }

          .col {
            display: table-cell;
            vertical-align: top;
          }

          .header-title {
            text-align: right;
            font-weight: 700;
            font-size: 18px;
            line-height: 1.2;
          }

          .company-title,
          .customer-title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px;
          }

          .meta-line {
            margin: 2px 0;
            font-size: 12px;
          }

          .qr-box {
            margin-top: 12px;
            width: 126px;
            height: 126px;
            border: 1px solid #9ca3af;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .qr-box img {
            width: 120px;
            height: 120px;
            object-fit: contain;
          }

          .section-space {
            margin-top: 16px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          .summary-table th,
          .summary-table td,
          .items-table th,
          .items-table td {
            border: 1px solid #b4b4b4;
            padding: 6px 7px;
            font-size: 11px;
          }

          .summary-table th,
          .items-table th {
            background: #ececec;
            font-weight: 700;
          }

          .items-table td.text-right,
          .items-table th.text-right,
          .totals td.text-right {
            text-align: right;
          }

          .items-table td.text-center,
          .items-table th.text-center {
            text-align: center;
          }

          .totals {
            border: 1px solid #b4b4b4;
            margin-top: 14px;
          }

          .totals td {
            border: none;
            padding: 4px 8px;
            font-size: 12px;
          }

          .totals .label {
            width: 72%;
            text-align: right;
            font-weight: 600;
          }

          .totals .value {
            width: 28%;
            text-align: right;
            font-weight: 700;
          }

          .footer-note {
            margin-top: 14px;
            border-top: 1px solid #b4b4b4;
            text-align: center;
            font-size: 10px;
            padding-top: 8px;
          }
        </style>
      </head>
      <body>
        <main class="sheet">
          <section class="row">
            <div class="col" style="width: 22%;">
              <div style="width: 100px; height: 80px; border: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; text-align: center;">LOGO</div>
            </div>
            <div class="col" style="width: 46%;"></div>
            <div class="col" style="width: 32%; text-align: right;">
              <div class="header-title">${safeTypeLabel} Nº ${safeTypeCode} ${safeInvoiceNumber}</div>
              <div class="meta-line">${safeDate}</div>
              <div class="meta-line">Original</div>
            </div>
          </section>

          <section class="row section-space">
            <div class="col" style="width: 50%; padding-right: 8px;">
              <p class="company-title">${safeCompanyName}</p>
              <p class="meta-line">${safeCompanyAddress}</p>
              <p class="meta-line">Telefone: ${safeCompanyPhone}</p>
              <p class="meta-line">${safeCompanyEmail}</p>
              <p class="meta-line">NIF: ${safeCompanyDocumentCode}</p>
            </div>

            <div class="col" style="width: 50%; padding-left: 8px;">
              <p class="customer-title">${safeCustomerName}</p>
              <p class="meta-line">${safeCustomerAddress}</p>
              <p class="meta-line">Angola</p>
              <p class="meta-line">NIF Cliente: ${safeCustomerNif}</p>

              <div class="qr-box" style="margin-left: auto;">
                ${safeQrCodeDataUrl ? `<img src="${safeQrCodeDataUrl}" alt="QR Code da Fatura" />` : '<span style="font-size:10px; color:#6b7280;">Sem QR</span>'}
              </div>
            </div>
          </section>

          <section class="section-space">
            <table class="summary-table">
              <thead>
                <tr>
                  <th>Nº Cliente</th>
                  <th>NIF Cliente</th>
                  <th>Cond. de Pagamento</th>
                  <th>Método de Pagamento</th>
                  <th>Moeda</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>${safeCustomerNif}</td>
                  <td>Pronto Pagamento</td>
                  <td>${safePaymentMethod}</td>
                  <td>AOA</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="section-space">
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 12%;">Código</th>
                  <th style="width: 34%;">Designação</th>
                  <th style="width: 7%;" class="text-right">Qnt</th>
                  <th style="width: 6%;" class="text-center">Uni.</th>
                  <th style="width: 11%;" class="text-right">Preço</th>
                  <th style="width: 8%;" class="text-right">Desc</th>
                  <th style="width: 8%;" class="text-right">Taxa</th>
                  <th style="width: 14%;" class="text-right">Total</th>
                  <th style="width: 14%;" class="text-right">Total c/ IVA</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </section>

          <section class="totals">
            <table>
              <tr>
                <td class="label">Total Líquido</td>
                <td class="value">${taxableAmount}</td>
              </tr>
              <tr>
                <td class="label">Total Imposto</td>
                <td class="value">${vatAmount}</td>
              </tr>
              <tr>
                <td class="label">Total do Documento</td>
                <td class="value">${total}</td>
              </tr>
            </table>
          </section>

          <section class="footer-note">
            Documento processado por programa validado | Página: 1/1
          </section>
        </main>
      </body>
    </html>
  `;
}
