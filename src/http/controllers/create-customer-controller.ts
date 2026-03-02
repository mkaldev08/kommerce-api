import type { FastifyRequest, FastifyReply } from "fastify";
import { createCustomerBodySchema } from "./schemas/customers-schemas";
import { makeCreateCustomerUseCase } from "../../use-cases/factory/make-create-customer-use-case";

export async function CreateCustomerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createCustomerBodySchema.parse(request.body);

  const useCase = makeCreateCustomerUseCase();
  const { customer } = await useCase.execute({
    name: body.name,
    email: body.email || null,
    phoneNumber: body.phoneNumber || null,
    nif: body.nif || null,
    municipalityId: body.municipalityId,
    streetAddress: body.streetAddress || null,
    postalCode: body.postalCode || null,
  });

  return reply.status(201).send({ customer });
}
