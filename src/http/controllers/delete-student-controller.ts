import type { FastifyReply, FastifyRequest } from "fastify";
import { handleControllerError } from "./helpers/handle-controller-error";
import { studentParamsSchema } from "./schemas/students-schemas";
import { makeDeleteStudentUseCase } from "../../use-cases/factory/make-delete-student-use-case";

export async function DeleteStudentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId, id } = studentParamsSchema.parse(request.params);

    const useCase = makeDeleteStudentUseCase();
    await useCase.execute({ businessUnitId, id });

    return reply.status(204).send();
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
