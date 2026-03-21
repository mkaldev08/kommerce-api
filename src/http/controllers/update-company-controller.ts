import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { handleControllerError } from "./handle-controller-error";
import { MakeUpdateCompanyUseCase } from "@/use-cases/factory/make-update-company-use-case";

export async function UpdateCompanyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCompanyParamsSchema = z.object({
    companyId: z.uuid(),
  });

  const updateCompanyBodySchema = z
    .object({
      legal_name: z.string().trim().min(3).optional(),
      trade_name: z.string().trim().min(3).optional(),
      document_code_prefix: z.string().trim().min(2).optional(),
      vat_regime: z.enum(["SIMPLIFIED", "EXEMPTION", "GENERAL"]).optional(),
      share_capital: z.number().nonnegative().optional(),
      street_address: z.string().trim().min(5).optional(),
      postal_code: z.string().trim().optional().nullable(),
      municipality_id: z.uuid().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    });

  const { companyId } = updateCompanyParamsSchema.parse(request.params);
  const body = updateCompanyBodySchema.parse(request.body);

  try {
    const updateCompanyUseCase = MakeUpdateCompanyUseCase();

    const { company } = await updateCompanyUseCase.execute({
      companyId,
      ...body,
      postal_code: body.postal_code ?? null,
    });

    return reply.status(200).send({ company });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
