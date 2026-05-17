import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { handleControllerError } from '@/http/controllers/handle-controller-error'
import { PrismaGamingExpensesRepository } from '@/repositories/prisma/prisma-gaming-expenses-repository'
import { GamingExpenseReportPdfGeneratorService } from '@/services/generate-gaming-expense-report-pdf'
import { ExportGamingExpenseReportPdfUseCase } from '@/use-cases/export-gaming-expense-report-pdf-use-case'

const paramsSchema = z.object({
  businessUnitId: z.string().uuid(),
})

export async function exportGamingExpenseReportPdfController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { businessUnitId } = paramsSchema.parse(request.params)

  try {
    const expensesRepository = new PrismaGamingExpensesRepository()
    const pdfGenerator = new GamingExpenseReportPdfGeneratorService()
    const useCase = new ExportGamingExpenseReportPdfUseCase(
      expensesRepository,
      pdfGenerator,
    )

    const result = await useCase.execute({ businessUnitId })

    reply
      .header('Content-Type', 'application/pdf')
      .header(
        'Content-Disposition',
        `attachment; filename=\"${result.fileName}\"`,
      )
      .header('Content-Length', String(result.fileContent.byteLength))
      .send(result.fileContent)
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }
    throw error
  }
}
