import type { FastifyReply, FastifyRequest } from "fastify";
import { handleControllerError } from "./helpers/handle-controller-error";
import { listStudentsParamsSchema } from "./schemas/students-schemas";
import { makeListStudentsUseCase } from "../../use-cases/factory/make-list-students-use-case";

export async function ListStudentsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = listStudentsParamsSchema.parse(request.params);

    const useCase = makeListStudentsUseCase();
    const result = await useCase.execute({ businessUnitId });

    return reply.status(200).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
