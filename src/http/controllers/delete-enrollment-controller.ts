import type { FastifyReply, FastifyRequest } from "fastify";
import { makeDeleteEnrollmentUseCase } from "@/use-cases/factory/make-delete-enrollment-use-case";
import { idParamsSchema } from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function DeleteEnrollmentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = idParamsSchema.parse(request.params);

    const useCase = makeDeleteEnrollmentUseCase();
    await useCase.execute(id);

    return reply.status(204).send();
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
