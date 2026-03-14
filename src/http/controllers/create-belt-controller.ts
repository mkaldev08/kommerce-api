import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateBeltUseCase } from "@/use-cases/factory/make-create-belt-use-case";
import { createBeltBodySchema } from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function CreateBeltController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createBeltBodySchema.parse(request.body);
    const useCase = makeCreateBeltUseCase();
    const { belt } = await useCase.execute({
      name: body.name,
      description: body.description || null,
    });

    return reply.status(201).send({ belt });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
