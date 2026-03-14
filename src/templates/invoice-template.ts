import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export interface InvoiceTemplateItem {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceTemplateData {
  companyName: string;
  customerName: string;
  invoiceNumber: string;
  date: string;
  items: InvoiceTemplateItem[];
  total: number;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "AOA",
  minimumFractionDigits: 2,
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
  const safeCompanyName = escapeHtml(data.companyName);
  const safeCustomerName = escapeHtml(data.customerName);
  const safeInvoiceNumber = escapeHtml(data.invoiceNumber);
  const safeDate = escapeHtml(data.date);

  const rows = data.items
    .map((item) => {
      const safeDescription = escapeHtml(item.description);
      const quantity = item.quantity.toFixed(2);
      const unitPrice = CURRENCY_FORMATTER.format(item.price);
      const lineTotal = CURRENCY_FORMATTER.format(item.quantity * item.price);

      return `
        <tr class="border-b border-slate-200">
          <td class="py-2 pr-2 text-slate-800">${safeDescription}</td>
          <td class="py-2 px-2 text-right text-slate-700">${quantity}</td>
          <td class="py-2 px-2 text-right text-slate-700">${unitPrice}</td>
          <td class="py-2 pl-2 text-right font-medium text-slate-900">${lineTotal}</td>
        </tr>
      `;
    })
    .join("");

  const total = CURRENCY_FORMATTER.format(data.total);

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
            margin: 10mm;
          }

          html,
          body {
            width: 210mm;
            min-height: 297mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        </style>
      </head>
      <body class="bg-white text-slate-900 antialiased">
        <main class="mx-auto w-full max-w-4xl rounded-lg border border-slate-200 p-8">
          <header class="mb-8 flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 class="text-2xl font-bold tracking-tight">${safeCompanyName}</h1>
              <p class="mt-1 text-sm text-slate-600">Documento de fatura</p>
            </div>
            <div class="text-right text-sm text-slate-700">
              <p><span class="font-semibold">Fatura:</span> ${safeInvoiceNumber}</p>
              <p><span class="font-semibold">Data:</span> ${safeDate}</p>
            </div>
          </header>

          <section class="mb-6">
            <h2 class="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Cliente</h2>
            <p class="text-base font-medium">${safeCustomerName}</p>
          </section>

          <section>
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th class="py-2 pr-2">Descrição</th>
                  <th class="py-2 px-2 text-right">Qtd</th>
                  <th class="py-2 px-2 text-right">Preço Unit.</th>
                  <th class="py-2 pl-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </section>

          <footer class="mt-8 flex justify-end border-t border-slate-200 pt-4">
            <div class="w-72">
              <div class="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </footer>
        </main>
      </body>
    </html>
  `;
}
