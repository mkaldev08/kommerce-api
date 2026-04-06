import type { FastifyReply, FastifyRequest } from "fastify";
import { makeDeleteGamingCustomerUseCase } from "@/use-cases/factory/make-delete-gaming-customer-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import { gamingEntityIdParamsSchema } from "./schemas/gaming-house-schemas";

export async function DeleteGamingCustomerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = gamingEntityIdParamsSchema.parse(request.params);

    const useCase = makeDeleteGamingCustomerUseCase();
    await useCase.execute({ id });

    return reply.status(204).send();
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
