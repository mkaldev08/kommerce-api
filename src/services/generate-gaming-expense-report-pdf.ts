import { generatePdf } from '@/services/generate-pdf'
import { renderGamingExpenseReportTemplate } from '@/templates/gaming-expense-report-template'
import type { GamingExpenseReportPdfGenerator } from '@/use-cases/services/gaming-expense-report-pdf-generator'

export class GamingExpenseReportPdfGeneratorService
  implements GamingExpenseReportPdfGenerator
{
  async generate(data: { expenses: Array<any> }): Promise<Buffer> {
    const html = renderGamingExpenseReportTemplate(data)
    return generatePdf(html, { format: 'A4' })
  }
}
