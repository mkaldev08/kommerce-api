import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateEnrollmentUseCase } from "@/use-cases/factory/make-create-enrollment-use-case";
import {
  businessUnitParamsSchema,
  createEnrollmentBodySchema,
} from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function CreateEnrollmentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = businessUnitParamsSchema.parse(request.params);
    const body = createEnrollmentBodySchema.parse(request.body);
    const useCase = makeCreateEnrollmentUseCase();
    const { enrollment } = await useCase.execute({
      studentId: body.studentId,
      classId: body.classId,
      businessUnitId,
      startDate: body.startDate,
      endDate: body.endDate ?? null,
    });

    return reply.status(201).send({ enrollment });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
