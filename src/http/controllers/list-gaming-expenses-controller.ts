import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListGamingExpensesUseCase } from "@/use-cases/factory/make-list-gaming-expenses-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import { gamingBusinessUnitParamsSchema } from "./schemas/gaming-house-schemas";

export async function ListGamingExpensesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(request.params);

    const useCase = makeListGamingExpensesUseCase();
    const result = await useCase.execute({ businessUnitId });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
