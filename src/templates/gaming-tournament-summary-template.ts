export function renderGamingTournamentSummaryTemplate(data: {
  tournaments: Array<any>
}): string {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Resumo de Torneios de Jogos</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; color: #22223b; background: #f8f9fa; }
          .pdf-container { max-width: 900px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px #0001; padding: 40px 48px 32px 48px; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; border-bottom: 2px solid #e9ecef; padding-bottom: 16px; }
          .logo { height: 48px; }
          .title { font-size: 30px; font-weight: 700; color: #3a3a40; letter-spacing: 1px; }
          .meta { margin-bottom: 24px; color: #6c757d; font-size: 16px; }
          .section-title { font-size: 20px; font-weight: 600; margin: 24px 0 12px; color: #4f4f6e; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; border-radius: 8px; overflow: hidden; }
          th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; font-size: 15px; }
          th { background: #e9ecef; font-weight: 700; }
          tr:nth-child(even) { background: #f8f9fa; }
          .footer { margin-top: 40px; text-align: right; color: #adb5bd; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="header">
            <div class="title">Resumo de Torneios de Jogos</div>
            <!-- <img class="logo" src="LOGO_URL" alt="Logo" /> -->
          </div>
          <div class="meta">Gerado em: ${new Date().toLocaleString('pt-PT')}</div>
          <div class="section-title">Torneios</div>
          <table>
            <thead>
              <tr><th>Nome</th><th>Jogo</th><th>Status</th><th>Data Início</th><th>Data Fim</th><th>Vencedor</th></tr>
            </thead>
            <tbody>
              ${(data.tournaments || [])
                .map(
                  (t: any) => `<tr>
                <td>${t.name}</td>
                <td>${t.game?.name ?? '-'}</td>
                <td>${t.status}</td>
                <td>${t.start_date ?? '-'}</td>
                <td>${t.end_date ?? '-'}</td>
                <td>${t.winner_customer?.name ?? '-'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
          <div class="footer">KommerceApp &copy; ${new Date().getFullYear()}</div>
        </div>
      </body>
    </html>
  `
}
