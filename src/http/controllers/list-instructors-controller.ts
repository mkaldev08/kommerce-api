import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListInstructorsUseCase } from "@/use-cases/factory/make-list-instructors-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function ListInstructorsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const useCase = makeListInstructorsUseCase();
    const { instructors } = await useCase.execute();
    return reply.status(200).send({ instructors });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
