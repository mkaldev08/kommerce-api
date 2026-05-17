export function renderGamingSessionReceiptTemplate(data: any): string {
  // TODO: Replace 'any' with the correct type and add more professional layout
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Recibo de Sessão de Jogo</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 32px; color: #22223b; background: #f8f9fa; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
          .logo { height: 48px; }
          .title { font-size: 28px; font-weight: 700; color: #3a3a40; }
          .meta, .details { margin-bottom: 18px; }
          .meta p, .details p { margin: 2px 0; font-size: 15px; }
          .section-title { font-size: 18px; font-weight: 600; margin: 18px 0 8px; color: #4f4f6e; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #dee2e6; padding: 10px; text-align: left; font-size: 15px; }
          th { background: #e9ecef; }
          .total { font-size: 18px; font-weight: 700; color: #2d6a4f; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Recibo de Sessão de Jogo</div>
          <!-- <img class="logo" src="LOGO_URL" alt="Logo" /> -->
        </div>
        <div class="meta">
          <p><strong>ID Sessão:</strong> ${data.id}</p>
          <p><strong>Data:</strong> ${data.start_time}</p>
          <p><strong>Cliente:</strong> ${data.customer?.name ?? 'N/A'}</p>
        </div>
        <div class="details">
          <p><strong>Console:</strong> ${data.console?.name ?? 'N/A'}</p>
          <p><strong>Jogo:</strong> ${data.game?.name ?? 'N/A'}</p>
          <p><strong>Duração:</strong> ${data.duration_minutes ?? 0} minutos</p>
        </div>
        <div class="section-title">Pagamentos</div>
        <table>
          <thead>
            <tr><th>Método</th><th>Valor</th></tr>
          </thead>
          <tbody>
            ${(data.payments || []).map((p: any) => `<tr><td>${p.method}</td><td>${p.amount}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="total">Total: ${data.total_amount ?? 0} AOA</div>
      </body>
    </html>
  `
}
