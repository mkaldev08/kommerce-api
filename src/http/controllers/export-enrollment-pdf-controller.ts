import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleControllerError } from "@/http/controllers/handle-controller-error";
import { PrismaEnrollmentReportRepository } from "@/repositories/prisma/prisma-enrollment-report-repository";
import { EnrollmentPdfGeneratorService } from "@/services/generate-enrollment-pdf";
import { ExportEnrollmentPdfUseCase } from "@/use-cases/export-enrollment-pdf-use-case";

const exportEnrollmentPdfParamsSchema = z.object({
  businessUnitId: z.string().uuid(),
  id: z.string().uuid(),
});

export async function exportEnrollmentPdfController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { businessUnitId, id } = exportEnrollmentPdfParamsSchema.parse(
    request.params,
  );

  try {
    const reportRepository = new PrismaEnrollmentReportRepository();
    const pdfGenerator = new EnrollmentPdfGeneratorService();

    const useCase = new ExportEnrollmentPdfUseCase(reportRepository, pdfGenerator);

    const result = await useCase.execute({
      enrollmentId: id,
      businessUnitId,
    });

    reply
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", `attachment; filename="${result.fileName}"`)
      .header("Content-Length", String(result.fileContent.byteLength))
      .send(result.fileContent);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
