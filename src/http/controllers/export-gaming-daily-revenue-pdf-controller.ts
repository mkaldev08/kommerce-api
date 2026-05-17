import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { handleControllerError } from '@/http/controllers/handle-controller-error'
import { PrismaGamingReportsRepository } from '@/repositories/prisma/prisma-gaming-reports-repository'
import { GamingDailyRevenuePdfGeneratorService } from '@/services/generate-gaming-daily-revenue-pdf'
import { ExportGamingDailyRevenuePdfUseCase } from '@/use-cases/export-gaming-daily-revenue-pdf-use-case'

const paramsSchema = z.object({
  businessUnitId: z.string().uuid(),
})

export async function exportGamingDailyRevenuePdfController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { businessUnitId } = paramsSchema.parse(request.params)

  try {
    const reportRepository = new PrismaGamingReportsRepository()
    const pdfGenerator = new GamingDailyRevenuePdfGeneratorService()
    const useCase = new ExportGamingDailyRevenuePdfUseCase(
      reportRepository,
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
