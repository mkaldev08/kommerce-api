import type { FastifyRequest, FastifyReply } from "fastify";
import { makeFindCustomerByIdUseCase } from "../../use-cases/factory/make-find-customer-by-id-use-case";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function FindCustomerByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = paramsSchema.parse(request.params);

  const useCase = makeFindCustomerByIdUseCase();
  const result = await useCase.execute({ id });

  return reply.status(200).send(result);
}
