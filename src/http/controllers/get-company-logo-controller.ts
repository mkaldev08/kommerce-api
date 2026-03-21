import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaCompaniesRepository } from "@/repositories/prisma/prisma-companies-repository";

const getCompanyLogoParamsSchema = z.object({
  companyId: z.string().uuid(),
});

export async function getCompanyLogoController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { companyId } = getCompanyLogoParamsSchema.parse(request.params);

  const companiesRepository = new PrismaCompaniesRepository();
  const company = await companiesRepository.findById(companyId);

  if (!company || !company.image_data || !company.image_type) {
    reply.status(404).send({ message: "Logo da empresa não encontrada" });
    return;
  }

  const imageBuffer = Buffer.from(company.image_data, "base64");

  reply
    .header("Content-Type", company.image_type)
    .header("Cache-Control", "public, max-age=86400")
    .send(imageBuffer);
}
