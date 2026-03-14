import type { FastifyReply, FastifyRequest } from "fastify";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
  studentParamsSchema,
  updateStudentBodySchema,
} from "./schemas/students-schemas";
import { makeUpdateStudentUseCase } from "../../use-cases/factory/make-update-student-use-case";

export async function UpdateStudentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId, id } = studentParamsSchema.parse(request.params);
    const body = updateStudentBodySchema.parse(request.body);

    const useCase = makeUpdateStudentUseCase();
    const result = await useCase.execute({
      id,
      businessUnitId,
      ...body,
    });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
