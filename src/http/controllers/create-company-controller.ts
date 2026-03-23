import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CompanyAlreadyExistsError } from "@/use-cases/errors/company-already-exists-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeCreateCompanyUseCase } from "@/use-cases/factory/make-create-company-use-case";

export async function CreateCompany(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCompanyBodySchema = z.object({
    trade_name: z.string(),
    commercial_registry: z.string().trim().min(9),
    document_code_prefix: z.string().trim().min(2).optional(),
    document_code: z.string().trim().min(2).optional(),
    nif: z.string().trim().min(9),
    legal_name: z.string(),
    email: z.email().trim(),
    phone_number: z.string().trim().min(9),
    street_address: z.string(),
    owner_id: z.string().trim().min(1),
    municipality_id: z.string(),
    vat_regime: z
      .enum(["SIMPLIFIED", "EXEMPTION", "GENERAL"])
      .default("SIMPLIFIED"),
    share_capital: z.number().optional(),
    postal_code: z.string().optional(),
  });

  const createCompanyParamsSchema = z.object({
    ownerId: z.string().trim().min(1),
  });

  const { ownerId } = createCompanyParamsSchema.parse(request.params);
  const companyData = createCompanyBodySchema.parse(request.body);
  const documentCodePrefix =
    companyData.document_code_prefix ?? companyData.document_code;

  if (!documentCodePrefix) {
    reply.status(400).send({ message: "document_code_prefix é obrigatório" });
    return;
  }

  try {
    const createCompanyUseCase = MakeCreateCompanyUseCase();

    await createCompanyUseCase.execute({
      ...companyData,
      document_code_prefix: documentCodePrefix,
      owner_id: ownerId,
    });
  } catch (err) {
    if (err instanceof CompanyAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: "Dados inválidos no pedido." });
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(403).send({ message: err.message });
    }

    throw err;
  }

  reply.status(201).send();
}
