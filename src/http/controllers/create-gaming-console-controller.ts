import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGamingConsoleUseCase } from "@/use-cases/factory/make-create-gaming-console-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    createGamingConsoleBodySchema,
    gamingBusinessUnitParamsSchema,
} from "./schemas/gaming-house-schemas";

export async function CreateGamingConsoleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(request.params);
    const body = createGamingConsoleBodySchema.parse(request.body);

    const useCase = makeCreateGamingConsoleUseCase();
    const result = await useCase.execute({
      businessUnitId,
      name: body.name,
      brand: body.brand || null,
      model: body.model || null,
      hourlyRate: body.hourlyRate,
      status: body.status,
      isActive: body.isActive,
    });

    return reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
