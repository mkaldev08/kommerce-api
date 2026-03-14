import type { FastifyReply, FastifyRequest } from "fastify";
import { makeUpdateEnrollmentUseCase } from "@/use-cases/factory/make-update-enrollment-use-case";
import {
  idParamsSchema,
  updateEnrollmentBodySchema,
} from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function UpdateEnrollmentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = idParamsSchema.parse(request.params);
    const body = updateEnrollmentBodySchema.parse(request.body);

    const useCase = makeUpdateEnrollmentUseCase();
    const { enrollment } = await useCase.execute({
      id,
      classId: body.classId,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    return reply.status(200).send({ enrollment });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
