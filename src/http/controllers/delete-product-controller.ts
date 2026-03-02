import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeDeleteProductInventoryUseCase } from "@/use-cases/factory/make-delete-product-inventory-use-case";
import { handleControllerError } from "./handle-controller-error";
import { deleteProductParamsSchema } from "./schemas/inventory-schemas";

export async function DeleteProductController(
  request: FastifyRequest<{
    Params: {
      productId: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { productId } = deleteProductParamsSchema.parse(request.params);

  try {
    const deleteProductInventoryUseCase = MakeDeleteProductInventoryUseCase();

    await deleteProductInventoryUseCase.execute({
      productId,
    });

    return reply.status(204).send();
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
