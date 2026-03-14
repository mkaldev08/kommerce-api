import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListSchoolYearsUseCase } from "@/use-cases/factory/make-list-school-years-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function ListSchoolYearsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const useCase = makeListSchoolYearsUseCase();
    const { schoolYears } = await useCase.execute();
    return reply.status(200).send({ schoolYears });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
