import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListEnrollmentsUseCase } from "@/use-cases/factory/make-list-enrollments-use-case";
import { businessUnitParamsSchema } from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function ListEnrollmentsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = businessUnitParamsSchema.parse(request.params);
    const useCase = makeListEnrollmentsUseCase();
    const { enrollments } = await useCase.execute(businessUnitId);

    return reply.status(200).send({ enrollments });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
