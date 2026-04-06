import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGamingCustomerUseCase } from "@/use-cases/factory/make-create-gaming-customer-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    createGamingCustomerBodySchema,
    gamingBusinessUnitParamsSchema,
} from "./schemas/gaming-house-schemas";

export async function CreateGamingCustomerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(request.params);
    const body = createGamingCustomerBodySchema.parse(request.body);

    const useCase = makeCreateGamingCustomerUseCase();
    const result = await useCase.execute({
      businessUnitId,
      name: body.name,
      email: body.email || null,
      phoneNumber: body.phoneNumber || null,
      notes: body.notes || null,
    });

    return reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
