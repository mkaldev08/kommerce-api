import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { updateCustomerBodySchema } from "./schemas/customers-schemas";
import { makeUpdateCustomerUseCase } from "../../use-cases/factory/make-update-customer-use-case";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function UpdateCustomerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = paramsSchema.parse(request.params);
  const body = updateCustomerBodySchema.parse(request.body);

  const useCase = makeUpdateCustomerUseCase();
  const result = await useCase.execute({
    id,
    ...body,
  });

  return reply.status(200).send(result);
}
