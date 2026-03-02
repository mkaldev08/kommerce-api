import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeListProductsUseCase } from "@/use-cases/factory/make-list-products-use-case";
import { handleControllerError } from "./handle-controller-error";
import { listProductsQuerySchema } from "./schemas/inventory-schemas";

export async function ListProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { businessUnitId } = listProductsQuerySchema.parse(request.query);

  try {
    const listProductsUseCase = MakeListProductsUseCase();

    const { products } = await listProductsUseCase.execute({
      businessUnitId,
    });

    return reply.status(200).send({ products });
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return;
    }

    throw err;
  }
}
