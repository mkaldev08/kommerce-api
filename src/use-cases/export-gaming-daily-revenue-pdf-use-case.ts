import type { GamingReportsRepository } from '@/repositories/gaming-reports-repository'
import type { GamingDailyRevenuePdfGenerator } from '@/use-cases/services/gaming-daily-revenue-pdf-generator'

interface ExportGamingDailyRevenuePdfUseCaseRequest {
  businessUnitId: string
}

interface ExportGamingDailyRevenuePdfUseCaseResponse {
  fileName: string
  fileContent: Buffer
}

export class ExportGamingDailyRevenuePdfUseCase {
  constructor(
    private reportsRepository: GamingReportsRepository,
    private pdfGenerator: GamingDailyRevenuePdfGenerator,
  ) {}

  async execute(
    request: ExportGamingDailyRevenuePdfUseCaseRequest,
  ): Promise<ExportGamingDailyRevenuePdfUseCaseResponse> {
    const revenue = await this.reportsRepository.getRevenueByDay(
      request.businessUnitId,
      30,
    )
    const fileContent = await this.pdfGenerator.generate({ revenue })
    return {
      fileName: `gaming-daily-revenue-${request.businessUnitId}.pdf`,
      fileContent,
    }
  }
}
