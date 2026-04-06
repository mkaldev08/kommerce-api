import type { FastifyReply, FastifyRequest } from "fastify";
import { makeEndGamingSessionUseCase } from "@/use-cases/factory/make-end-gaming-session-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    endGamingSessionBodySchema,
    gamingSessionIdParamsSchema,
} from "./schemas/gaming-house-schemas";

export async function EndGamingSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sessionId } = gamingSessionIdParamsSchema.parse(request.params);
    const body = endGamingSessionBodySchema.parse(request.body);

    const useCase = makeEndGamingSessionUseCase();
    const result = await useCase.execute({
      sessionId,
      endTime: body.endTime,
    });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
