import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { handleControllerError } from '@/http/controllers/handle-controller-error'
import { PrismaGamingTournamentsRepository } from '@/repositories/prisma/prisma-gaming-tournaments-repository'
import { GamingTournamentSummaryPdfGeneratorService } from '@/services/generate-gaming-tournament-summary-pdf'
import { ExportGamingTournamentSummaryPdfUseCase } from '@/use-cases/export-gaming-tournament-summary-pdf-use-case'

const paramsSchema = z.object({
  businessUnitId: z.string().uuid(),
})

export async function exportGamingTournamentSummaryPdfController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { businessUnitId } = paramsSchema.parse(request.params)

  try {
    const tournamentsRepository = new PrismaGamingTournamentsRepository()
    const pdfGenerator = new GamingTournamentSummaryPdfGeneratorService()
    const useCase = new ExportGamingTournamentSummaryPdfUseCase(
      tournamentsRepository,
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
