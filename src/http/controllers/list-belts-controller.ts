import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListBeltsUseCase } from "@/use-cases/factory/make-list-belts-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";

export async function ListBeltsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const useCase = makeListBeltsUseCase();
    const { belts } = await useCase.execute();
    return reply.status(200).send({ belts });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
