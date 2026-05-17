export function renderGamingExpenseReportTemplate(data: {
  expenses: Array<any>
}): string {
  // TODO: Replace 'any' with the correct type and add more professional layout
  const total = (data.expenses || []).reduce(
    (sum, e) => sum + (e.amount || 0),
    0,
  )
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Relatório de Despesas de Jogos</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 32px; color: #22223b; background: #f8f9fa; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
          .logo { height: 48px; }
          .title { font-size: 28px; font-weight: 700; color: #3a3a40; }
          .meta { margin-bottom: 18px; }
          .section-title { font-size: 18px; font-weight: 600; margin: 18px 0 8px; color: #4f4f6e; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #dee2e6; padding: 10px; text-align: left; font-size: 15px; }
          th { background: #e9ecef; }
          .total { font-size: 18px; font-weight: 700; color: #b02a37; margin-top: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Relatório de Despesas de Jogos</div>
        </div>
        <div class="meta">
          <p><strong>Total de Despesas:</strong> ${data.expenses.length}</p>
        </div>
        <div class="section-title">Despesas</div>
        <table>
          <thead>
            <tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Valor (AOA)</th></tr>
          </thead>
          <tbody>
            ${(data.expenses || [])
              .map(
                (e: any) => `<tr>
              <td>${e.description}</td>
              <td>${e.category ?? '-'}</td>
              <td>${e.expense_date ?? '-'}</td>
              <td>${e.amount?.toFixed(2) ?? '0.00'}</td>
            </tr>`,
              )
              .join('')}
          </tbody>
        </table>
        <div class="total">Total: ${total.toFixed(2)} AOA</div>
      </body>
    </html>
  `
}
