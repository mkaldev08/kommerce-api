import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeDeleteCustomerUseCase } from "../../use-cases/factory/make-delete-customer-use-case";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function DeleteCustomerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = paramsSchema.parse(request.params);

  const useCase = makeDeleteCustomerUseCase();
  await useCase.execute({ id });

  return reply.status(204).send();
}
