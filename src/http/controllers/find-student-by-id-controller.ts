import type { FastifyReply, FastifyRequest } from "fastify";
import { handleControllerError } from "./helpers/handle-controller-error";
import { studentParamsSchema } from "./schemas/students-schemas";
import { makeFindStudentByIdUseCase } from "../../use-cases/factory/make-find-student-by-id-use-case";

export async function FindStudentByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId, id } = studentParamsSchema.parse(request.params);

    const useCase = makeFindStudentByIdUseCase();
    const result = await useCase.execute({ businessUnitId, id });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
