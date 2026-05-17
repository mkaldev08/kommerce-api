import type { GamingTournamentsRepository } from '@/repositories/gaming-tournaments-repository'
import type { GamingTournamentSummaryPdfGenerator } from '@/use-cases/services/gaming-tournament-summary-pdf-generator'

interface ExportGamingTournamentSummaryPdfUseCaseRequest {
  businessUnitId: string
}

interface ExportGamingTournamentSummaryPdfUseCaseResponse {
  fileName: string
  fileContent: Buffer
}

export class ExportGamingTournamentSummaryPdfUseCase {
  constructor(
    private tournamentsRepository: GamingTournamentsRepository,
    private pdfGenerator: GamingTournamentSummaryPdfGenerator,
  ) {}

  async execute(
    request: ExportGamingTournamentSummaryPdfUseCaseRequest,
  ): Promise<ExportGamingTournamentSummaryPdfUseCaseResponse> {
    const tournaments = await this.tournamentsRepository.findByBusinessUnitId(
      request.businessUnitId,
    )
    const fileContent = await this.pdfGenerator.generate({ tournaments })
    return {
      fileName: `gaming-tournament-summary-${request.businessUnitId}.pdf`,
      fileContent,
    }
  }
}
