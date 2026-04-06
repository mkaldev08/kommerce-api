import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGamingTournamentUseCase } from "@/use-cases/factory/make-create-gaming-tournament-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    createGamingTournamentBodySchema,
    gamingBusinessUnitParamsSchema,
} from "./schemas/gaming-house-schemas";

export async function CreateGamingTournamentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(request.params);
    const body = createGamingTournamentBodySchema.parse(request.body);

    const useCase = makeCreateGamingTournamentUseCase();
    const result = await useCase.execute({
      businessUnitId,
      gameId: body.gameId,
      name: body.name,
      startDate: body.startDate,
      endDate: body.endDate,
      entryFee: body.entryFee,
      prizePool: body.prizePool,
      status: body.status,
      winnerCustomerId: body.winnerCustomerId,
    });

    return reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
