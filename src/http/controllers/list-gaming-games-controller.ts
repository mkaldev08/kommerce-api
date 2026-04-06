import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListGamingGamesUseCase } from "@/use-cases/factory/make-list-gaming-games-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import { gamingBusinessUnitParamsSchema } from "./schemas/gaming-house-schemas";

export async function ListGamingGamesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(request.params);
    const useCase = makeListGamingGamesUseCase();
    const result = await useCase.execute({ businessUnitId });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
