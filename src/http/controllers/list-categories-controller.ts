import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeListCategoriesUseCase } from "@/use-cases/factory/make-list-categories-use-case";
import { handleControllerError } from "./handle-controller-error";

export async function ListCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const listCategoriesUseCase = MakeListCategoriesUseCase();

    const { categories } = await listCategoriesUseCase.execute();

    return reply.status(200).send({ categories });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
