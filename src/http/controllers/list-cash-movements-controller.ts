import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaCashMovementsRepository } from "@/repositories/prisma/prisma-cash-movements-repository";
import { ListCashMovementsUseCase } from "@/use-cases/list-cash-movements-use-case";
import { handleControllerError } from "./handle-controller-error";

const listCashMovementsQuerySchema = z.object({
  cashRegisterId: z.string().uuid(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export async function listCashMovementsController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const query = listCashMovementsQuerySchema.parse(request.query);

  const now = new Date();
  const from =
    query.from ??
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const to =
    query.to ??
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  try {
    const cashMovementsRepository = new PrismaCashMovementsRepository();
    const useCase = new ListCashMovementsUseCase(cashMovementsRepository);

    const result = await useCase.execute({
      cashRegisterId: query.cashRegisterId,
      from,
      to,
    });

    reply.send({
      movements: result.movements.map((movement) => ({
        id: movement.id,
        type: movement.type,
        amount: movement.amount,
        description: movement.description,
        movementDate: movement.movementDate.toISOString(),
        cashRegisterId: movement.cashRegisterId,
      })),
    });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
