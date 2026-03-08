import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CashMovementType } from "generated/prisma/enums";
import { PrismaCashMovementsRepository } from "@/repositories/prisma/prisma-cash-movements-repository";
import { PrismaCashRegistersRepository } from "@/repositories/prisma/prisma-cash-registers-repository";
import { CreateCashMovementUseCase } from "@/use-cases/create-cash-movement-use-case";
import { handleControllerError } from "./handle-controller-error";

const createCashMovementBodySchema = z.object({
  cashRegisterId: z.string().uuid(),
  type: z.nativeEnum(CashMovementType),
  amount: z.number().positive(),
  description: z.string().trim().min(1).optional(),
});

export async function createCashMovementController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = createCashMovementBodySchema.parse(request.body);

  try {
    const cashRegistersRepository = new PrismaCashRegistersRepository();
    const cashMovementsRepository = new PrismaCashMovementsRepository();

    const useCase = new CreateCashMovementUseCase(
      cashRegistersRepository,
      cashMovementsRepository,
    );

    const result = await useCase.execute(body);

    reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
