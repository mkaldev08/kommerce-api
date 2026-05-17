import type { GamingExpensesRepository } from '@/repositories/gaming-expenses-repository'
import type { GamingExpenseReportPdfGenerator } from '@/use-cases/services/gaming-expense-report-pdf-generator'

interface ExportGamingExpenseReportPdfUseCaseRequest {
  businessUnitId: string
}

interface ExportGamingExpenseReportPdfUseCaseResponse {
  fileName: string
  fileContent: Buffer
}

export class ExportGamingExpenseReportPdfUseCase {
  constructor(
    private expensesRepository: GamingExpensesRepository,
    private pdfGenerator: GamingExpenseReportPdfGenerator,
  ) {}

  async execute(
    request: ExportGamingExpenseReportPdfUseCaseRequest,
  ): Promise<ExportGamingExpenseReportPdfUseCaseResponse> {
    const expenses = await this.expensesRepository.findByBusinessUnitId(
      request.businessUnitId,
    )
    const fileContent = await this.pdfGenerator.generate({ expenses })
    return {
      fileName: `gaming-expense-report-${request.businessUnitId}.pdf`,
      fileContent,
    }
  }
}
