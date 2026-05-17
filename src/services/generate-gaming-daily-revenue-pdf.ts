import { generatePdf } from '@/services/generate-pdf'
import { renderGamingDailyRevenueTemplate } from '@/templates/gaming-daily-revenue-template'
import type { GamingDailyRevenuePdfGenerator } from '@/use-cases/services/gaming-daily-revenue-pdf-generator'

export class GamingDailyRevenuePdfGeneratorService
  implements GamingDailyRevenuePdfGenerator
{
  async generate(data: {
    revenue: Array<{ label: string; revenue: number }>
  }): Promise<Buffer> {
    const html = renderGamingDailyRevenueTemplate(data)
    return generatePdf(html, { format: 'A4' })
  }
}
