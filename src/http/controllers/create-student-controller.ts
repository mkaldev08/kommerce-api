import type { FastifyReply, FastifyRequest } from "fastify";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
  createStudentBodySchema,
  listStudentsParamsSchema,
} from "./schemas/students-schemas";
import { makeCreateStudentUseCase } from "../../use-cases/factory/make-create-student-use-case";

export async function CreateStudentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = listStudentsParamsSchema.parse(request.params);
    const body = createStudentBodySchema.parse(request.body);

    const useCase = makeCreateStudentUseCase();
    const { student } = await useCase.execute({
      name: body.name,
      email: body.email || null,
      phoneNumber: body.phoneNumber || null,
      guardianName: body.guardianName || null,
      guardianPhoneNumber: body.guardianPhoneNumber || null,
      notes: body.notes || null,
      businessUnitId,
    });

    return reply.status(201).send({ student });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
