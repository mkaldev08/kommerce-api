import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleControllerError } from "@/http/controllers/handle-controller-error";
import { PrismaInvoiceReportRepository } from "@/repositories/prisma/prisma-invoice-report-repository";
import { PuppeteerInvoicePdfGenerator } from "@/services/generate-pdf";
import { ExportInvoicePdfUseCase } from "@/use-cases/export-invoice-pdf-use-case";

const exportInvoicePdfParamsSchema = z.object({
  id: z.uuid(),
});

export async function exportInvoicePdfController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = exportInvoicePdfParamsSchema.parse(request.params);

  try {
    const invoiceReportRepository = new PrismaInvoiceReportRepository();
    const invoicePdfGenerator = new PuppeteerInvoicePdfGenerator();

    const exportInvoicePdfUseCase = new ExportInvoicePdfUseCase(
      invoiceReportRepository,
      invoicePdfGenerator,
    );

    const result = await exportInvoicePdfUseCase.execute({
      invoiceId: id,
    });

    reply
      .header("Content-Type", "application/pdf")
      .header(
        "Content-Disposition",
        `attachment; filename="${result.fileName}"`,
      )
      .header("Content-Length", String(result.fileContent.byteLength))
      .send(result.fileContent);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
