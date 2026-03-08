import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaCashRegistersRepository } from "@/repositories/prisma/prisma-cash-registers-repository";
import { GetOpenCashRegisterUseCase } from "@/use-cases/get-open-cash-register-use-case";
import { handleControllerError } from "./handle-controller-error";

const getOpenCashRegisterParamsSchema = z.object({
  businessUnitId: z.string().uuid(),
});

export async function getOpenCashRegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { businessUnitId } = getOpenCashRegisterParamsSchema.parse(
    request.params,
  );

  try {
    const cashRegistersRepository = new PrismaCashRegistersRepository();
    const useCase = new GetOpenCashRegisterUseCase(cashRegistersRepository);

    const result = await useCase.execute({ businessUnitId });

    reply.send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
