import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListGamingSessionPaymentsUseCase } from "@/use-cases/factory/make-list-gaming-session-payments-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import { gamingSessionIdParamsSchema } from "./schemas/gaming-house-schemas";

export async function ListGamingSessionPaymentsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sessionId } = gamingSessionIdParamsSchema.parse(request.params);

    const useCase = makeListGamingSessionPaymentsUseCase();
    const result = await useCase.execute({ sessionId });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
