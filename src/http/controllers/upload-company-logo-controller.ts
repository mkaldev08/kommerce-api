import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleControllerError } from "@/http/controllers/handle-controller-error";
import { PrismaCompaniesRepository } from "@/repositories/prisma/prisma-companies-repository";
import {
  isSupportedCompanyLogoMimeType,
  processCompanyLogo,
} from "@/services/process-company-logo";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

const uploadCompanyLogoParamsSchema = z.object({
  companyId: z.string().uuid(),
});

const MAX_LOGO_SIZE_BYTES = 4 * 1024 * 1024;

export async function uploadCompanyLogoController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { companyId } = uploadCompanyLogoParamsSchema.parse(request.params);

  try {
    const file = await request.file();

    if (!file) {
      reply.status(400).send({ message: "Ficheiro da logo é obrigatório" });
      return;
    }

    if (!isSupportedCompanyLogoMimeType(file.mimetype)) {
      reply.status(400).send({
        message: "Tipo de imagem inválido. Use PNG, JPG ou WEBP",
      });
      return;
    }

    const fileBuffer = await file.toBuffer();

    if (fileBuffer.byteLength > MAX_LOGO_SIZE_BYTES) {
      reply.status(400).send({
        message: "A imagem excede o tamanho máximo de 4MB",
      });
      return;
    }

    const companiesRepository = new PrismaCompaniesRepository();
    const company = await companiesRepository.findById(companyId);

    if (!company) {
      throw new ResourceNotFoundError();
    }

    const processedLogo = await processCompanyLogo(fileBuffer);

    await companiesRepository.updateLogo(
      companyId,
      processedLogo.base64Data,
      processedLogo.imageType,
    );

    reply.status(204).send();
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
