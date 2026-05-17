export function renderGamingDailyRevenueTemplate(data: {
  revenue: Array<{ label: string; revenue: number }>
}): string {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Relatório Diário de Receita</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { margin: 0 0 8px; font-size: 22px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 13px; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>Relatório Diário de Receita</h1>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Receita (AOA)</th>
            </tr>
          </thead>
          <tbody>
            ${data.revenue.map((r) => `<tr><td>${r.label}</td><td>${r.revenue.toFixed(2)}</td></tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `
}
