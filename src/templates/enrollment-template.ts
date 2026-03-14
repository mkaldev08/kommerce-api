import type { EnrollmentReportData } from "@/repositories/enrollment-report-repository";

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeZone: "Africa/Luanda",
});

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function renderEnrollmentTemplate(data: EnrollmentReportData): string {
  const startDate = DATE_FORMATTER.format(data.startDate);
  const endDate = data.endDate ? DATE_FORMATTER.format(data.endDate) : "Ativa";

  return `
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Relatório de inscrição</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 24px;
            color: #171717;
            background: #ffffff;
          }
          .card {
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
          }
          .title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px;
          }
          .subtitle {
            margin: 0;
            color: #525252;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            border-bottom: 1px solid #f1f1f1;
            padding: 10px 0;
            vertical-align: top;
          }
          .label {
            color: #737373;
            width: 220px;
          }
          .value {
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <section class="card">
          <h1 class="title">Relatório de Inscrição</h1>
          <p class="subtitle">Unidade: ${escapeHtml(data.businessUnitName)}</p>
        </section>

        <section class="card">
          <table>
            <tr>
              <td class="label">Aluno</td>
              <td class="value">${escapeHtml(data.studentName)}</td>
            </tr>
            <tr>
              <td class="label">Telefone do aluno</td>
              <td class="value">${escapeHtml(data.studentPhone || "Não informado")}</td>
            </tr>
            <tr>
              <td class="label">Turma</td>
              <td class="value">${escapeHtml(data.className)}</td>
            </tr>
            <tr>
              <td class="label">Horário</td>
              <td class="value">${escapeHtml(data.classSchedule)}</td>
            </tr>
            <tr>
              <td class="label">Professor</td>
              <td class="value">${escapeHtml(data.instructorName)}</td>
            </tr>
            <tr>
              <td class="label">Ano letivo</td>
              <td class="value">${escapeHtml(data.schoolYearName)}</td>
            </tr>
            <tr>
              <td class="label">Início da inscrição</td>
              <td class="value">${startDate}</td>
            </tr>
            <tr>
              <td class="label">Fim da inscrição</td>
              <td class="value">${endDate}</td>
            </tr>
          </table>
        </section>
      </body>
    </html>
  `;
}
