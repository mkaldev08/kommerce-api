import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeUpdateProductInventoryUseCase } from "@/use-cases/factory/make-update-product-inventory-use-case";
import { handleControllerError } from "./handle-controller-error";
import {
  updateProductBodySchema,
  updateProductParamsSchema,
} from "./schemas/inventory-schemas";

export async function UpdateProductController(
  request: FastifyRequest<{
    Params: {
      productId: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { productId } = updateProductParamsSchema.parse(request.params);
  const body = updateProductBodySchema.parse(request.body);

  try {
    const updateProductInventoryUseCase = MakeUpdateProductInventoryUseCase();

    const { product } = await updateProductInventoryUseCase.execute({
      productId,
      input: body,
    });

    return reply.status(200).send({ product });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
