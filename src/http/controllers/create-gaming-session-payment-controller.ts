import type { FastifyReply, FastifyRequest } from "fastify";
import { makeRegisterGamingSessionPaymentUseCase } from "@/use-cases/factory/make-register-gaming-session-payment-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    createGamingSessionPaymentBodySchema,
    gamingSessionIdParamsSchema,
} from "./schemas/gaming-house-schemas";

export async function CreateGamingSessionPaymentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sessionId } = gamingSessionIdParamsSchema.parse(request.params);
    const body = createGamingSessionPaymentBodySchema.parse(request.body);

    const useCase = makeRegisterGamingSessionPaymentUseCase();
    const result = await useCase.execute({
      sessionId,
      amount: body.amount,
      method: body.method,
      paymentDate: body.paymentDate,
    });

    return reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
