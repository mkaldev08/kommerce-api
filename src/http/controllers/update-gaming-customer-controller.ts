import type { FastifyReply, FastifyRequest } from "fastify";
import { makeUpdateGamingCustomerUseCase } from "@/use-cases/factory/make-update-gaming-customer-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    gamingEntityIdParamsSchema,
    updateGamingCustomerBodySchema,
} from "./schemas/gaming-house-schemas";

export async function UpdateGamingCustomerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = gamingEntityIdParamsSchema.parse(request.params);
    const body = updateGamingCustomerBodySchema.parse(request.body);

    const useCase = makeUpdateGamingCustomerUseCase();
    const result = await useCase.execute({
      id,
      data: {
        name: body.name,
        email: body.email || undefined,
        phoneNumber: body.phoneNumber || undefined,
        notes: body.notes || undefined,
      },
    });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
