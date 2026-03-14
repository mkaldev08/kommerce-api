import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateInstructorUseCase } from "@/use-cases/factory/make-create-instructor-use-case";
import { createInstructorBodySchema } from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function CreateInstructorController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createInstructorBodySchema.parse(request.body);
    const useCase = makeCreateInstructorUseCase();
    const { instructor } = await useCase.execute({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      beltId: body.beltId,
    });

    return reply.status(201).send({ instructor });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
