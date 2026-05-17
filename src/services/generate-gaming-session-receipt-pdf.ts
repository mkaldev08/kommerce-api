import type { GamingSessionData } from '@/repositories/gaming-sessions-repository'
import { generatePdf } from '@/services/generate-pdf'
import { renderGamingSessionReceiptTemplate } from '@/templates/gaming-session-receipt-template'
import type { GamingSessionReceiptPdfGenerator } from '@/use-cases/services/gaming-session-receipt-pdf-generator'

export class GamingSessionReceiptPdfGeneratorService
  implements GamingSessionReceiptPdfGenerator
{
  async generate(data: GamingSessionData): Promise<Buffer> {
    const html = renderGamingSessionReceiptTemplate(data)
    return generatePdf(html, { format: 'A4' })
  }
}
