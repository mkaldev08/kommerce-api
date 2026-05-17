import type { GamingSessionsRepository } from '@/repositories/gaming-sessions-repository'
import type { GamingSessionReceiptPdfGenerator } from '@/use-cases/services/gaming-session-receipt-pdf-generator'

interface ExportGamingSessionReceiptPdfUseCaseRequest {
  sessionId: string
}

interface ExportGamingSessionReceiptPdfUseCaseResponse {
  fileName: string
  fileContent: Buffer
}

export class ExportGamingSessionReceiptPdfUseCase {
  constructor(
    private sessionsRepository: GamingSessionsRepository,
    private pdfGenerator: GamingSessionReceiptPdfGenerator,
  ) {}

  async execute(
    request: ExportGamingSessionReceiptPdfUseCaseRequest,
  ): Promise<ExportGamingSessionReceiptPdfUseCaseResponse> {
    const session = await this.sessionsRepository.findById(request.sessionId)
    if (!session) throw new Error('Session not found')
    const fileContent = await this.pdfGenerator.generate(session)
    return {
      fileName: `gaming-session-receipt-${session.id}.pdf`,
      fileContent,
    }
  }
}
