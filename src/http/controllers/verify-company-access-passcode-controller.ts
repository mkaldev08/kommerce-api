import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { handleControllerError } from "./handle-controller-error";
import { MakeVerifyCompanyAccessPasscodeUseCase } from "@/use-cases/factory/make-verify-company-access-passcode-use-case";

export async function VerifyCompanyAccessPasscodeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const verifyPasscodeParamsSchema = z.object({
    companyId: z.uuid(),
  });

  const verifyPasscodeBodySchema = z.object({
    access_passcode: z.string().trim().min(4).max(32),
  });

  const { companyId } = verifyPasscodeParamsSchema.parse(request.params);
  const { access_passcode } = verifyPasscodeBodySchema.parse(request.body);

  try {
    const verifyCompanyAccessPasscodeUseCase =
      MakeVerifyCompanyAccessPasscodeUseCase();

    const { is_valid } = await verifyCompanyAccessPasscodeUseCase.execute({
      companyId,
      access_passcode,
    });

    return reply.status(200).send({ is_valid });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
