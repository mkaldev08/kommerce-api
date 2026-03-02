import type { FastifyRequest, FastifyReply } from "fastify";
import { makeListCustomersUseCase } from "../../use-cases/factory/make-list-customers-use-case";

export async function ListCustomersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeListCustomersUseCase();
  const result = await useCase.execute();

  return reply.status(200).send(result);
}
