import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { handleControllerError } from '@/http/controllers/handle-controller-error'
import { PrismaGamingSessionsRepository } from '@/repositories/prisma/prisma-gaming-sessions-repository'
import { GamingSessionReceiptPdfGeneratorService } from '@/services/generate-gaming-session-receipt-pdf'
import { ExportGamingSessionReceiptPdfUseCase } from '@/use-cases/export-gaming-session-receipt-pdf-use-case'

const paramsSchema = z.object({
  sessionId: z.string().uuid(),
})

export async function exportGamingSessionReceiptPdfController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { sessionId } = paramsSchema.parse(request.params)

  try {
    const sessionRepository = new PrismaGamingSessionsRepository()
    const pdfGenerator = new GamingSessionReceiptPdfGeneratorService()
    const useCase = new ExportGamingSessionReceiptPdfUseCase(
      sessionRepository,
      pdfGenerator,
    )

    const result = await useCase.execute({ sessionId })

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
