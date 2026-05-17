import { generatePdf } from '@/services/generate-pdf'
import { renderGamingTournamentSummaryTemplate } from '@/templates/gaming-tournament-summary-template'
import type { GamingTournamentSummaryPdfGenerator } from '@/use-cases/services/gaming-tournament-summary-pdf-generator'

export class GamingTournamentSummaryPdfGeneratorService
  implements GamingTournamentSummaryPdfGenerator
{
  async generate(data: { tournaments: Array<any> }): Promise<Buffer> {
    const html = renderGamingTournamentSummaryTemplate(data)
    return generatePdf(html, { format: 'A4' })
  }
}
