import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListEnrollmentFinancialPlansUseCase } from "@/use-cases/factory/make-list-enrollment-financial-plans-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
  idParamsSchema,
  listEnrollmentFinancialPlansQuerySchema,
} from "./schemas/academy-schemas";

export async function ListEnrollmentFinancialPlansController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId, id } = idParamsSchema.parse(request.params);
    const { schoolYearId, status } =
      listEnrollmentFinancialPlansQuerySchema.parse(request.query);

    const useCase = makeListEnrollmentFinancialPlansUseCase();
    const { financialPlans } = await useCase.execute({
      businessUnitId,
      enrollmentId: id,
      schoolYearId,
      status,
    });

    return reply.status(200).send({ financialPlans });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
