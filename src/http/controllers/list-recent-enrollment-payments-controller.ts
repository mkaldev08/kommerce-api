import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListRecentEnrollmentPaymentsUseCase } from "@/use-cases/factory/make-list-recent-enrollment-payments-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
  businessUnitParamsSchema,
  listRecentEnrollmentPaymentsQuerySchema,
} from "./schemas/academy-schemas";

export async function ListRecentEnrollmentPaymentsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = businessUnitParamsSchema.parse(request.params);
    const { search, limit } = listRecentEnrollmentPaymentsQuerySchema.parse(
      request.query,
    );

    const useCase = makeListRecentEnrollmentPaymentsUseCase();
    const { payments } = await useCase.execute({
      businessUnitId,
      search,
      limit,
    });

    return reply.status(200).send({ payments });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
