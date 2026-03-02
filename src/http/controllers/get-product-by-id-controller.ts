import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeGetProductByIdUseCase } from "@/use-cases/factory/make-get-product-by-id-use-case";
import { handleControllerError } from "./handle-controller-error";
import {
  getProductByIdParamsSchema,
  getProductByIdQuerySchema,
} from "./schemas/inventory-schemas";

export async function GetProductByIdController(
  request: FastifyRequest<{
    Params: {
      productId: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { businessUnitId } = getProductByIdQuerySchema.parse(request.query);
  const { productId } = getProductByIdParamsSchema.parse(request.params);

  try {
    const getProductByIdUseCase = MakeGetProductByIdUseCase();

    const { product } = await getProductByIdUseCase.execute({
      productId,
      businessUnitId,
    });

    return reply.status(200).send({ product });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
