import type { FastifyReply, FastifyRequest } from "fastify";
import { makeUpdateGamingConsoleUseCase } from "@/use-cases/factory/make-update-gaming-console-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    gamingEntityIdParamsSchema,
    updateGamingConsoleBodySchema,
} from "./schemas/gaming-house-schemas";

export async function UpdateGamingConsoleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = gamingEntityIdParamsSchema.parse(request.params);
    const body = updateGamingConsoleBodySchema.parse(request.body);

    const useCase = makeUpdateGamingConsoleUseCase();
    const result = await useCase.execute({
      id,
      data: {
        name: body.name,
        brand: body.brand || undefined,
        model: body.model || undefined,
        hourlyRate: body.hourlyRate,
        status: body.status,
        isActive: body.isActive,
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
