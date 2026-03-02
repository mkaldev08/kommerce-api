import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeCreateCategoryUseCase } from "@/use-cases/factory/make-create-category-use-case";
import { handleControllerError } from "./handle-controller-error";
import { createCategoryBodySchema } from "./schemas/inventory-schemas";

export async function CreateCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createCategoryBodySchema.parse(request.body);

  try {
    const createCategoryUseCase = MakeCreateCategoryUseCase();

    const { category } = await createCategoryUseCase.execute(body);

    return reply.status(201).send({ category });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
