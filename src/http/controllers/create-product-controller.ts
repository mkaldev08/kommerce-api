import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeCreateProductInventoryUseCase } from "@/use-cases/factory/make-create-product-inventory-use-case";
import { handleControllerError } from "./handle-controller-error";
import { createProductBodySchema } from "./schemas/inventory-schemas";

export async function CreateProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createProductBodySchema.parse(request.body);

  try {
    const createProductInventoryUseCase = MakeCreateProductInventoryUseCase();

    const { product } = await createProductInventoryUseCase.execute(body);

    return reply.status(201).send({ product });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
