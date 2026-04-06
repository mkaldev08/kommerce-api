import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListGamingCustomersUseCase } from "@/use-cases/factory/make-list-gaming-customers-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import { gamingBusinessUnitParamsSchema } from "./schemas/gaming-house-schemas";

export async function ListGamingCustomersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(request.params);
    const useCase = makeListGamingCustomersUseCase();
    const result = await useCase.execute({ businessUnitId });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
