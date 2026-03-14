import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateSchoolYearUseCase } from "@/use-cases/factory/make-create-school-year-use-case";
import { createSchoolYearBodySchema } from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function CreateSchoolYearController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createSchoolYearBodySchema.parse(request.body);
    const useCase = makeCreateSchoolYearUseCase();
    const { schoolYear } = await useCase.execute({
      name: body.name,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    return reply.status(201).send({ schoolYear });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
