import type { FastifyReply, FastifyRequest } from "fastify";
import { makeDeleteGamingGameUseCase } from "@/use-cases/factory/make-delete-gaming-game-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import { gamingEntityIdParamsSchema } from "./schemas/gaming-house-schemas";

export async function DeleteGamingGameController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = gamingEntityIdParamsSchema.parse(request.params);

    const useCase = makeDeleteGamingGameUseCase();
    await useCase.execute({ id });

    return reply.status(204).send();
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
