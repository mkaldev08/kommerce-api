import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateClassUseCase } from "@/use-cases/factory/make-create-class-use-case";
import { createClassBodySchema } from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function CreateClassController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createClassBodySchema.parse(request.body);
    const useCase = makeCreateClassUseCase();
    const { class: cls } = await useCase.execute({
      name: body.name,
      schedule: body.schedule,
      instructorId: body.instructorId,
      schoolYearId: body.schoolYearId,
    });

    return reply.status(201).send({ class: cls });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
