import type { FastifyReply, FastifyRequest } from "fastify";
import { makeRegisterEnrollmentPaymentUseCase } from "@/use-cases/factory/make-register-enrollment-payment-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
  enrollmentPaymentBodySchema,
  idParamsSchema,
} from "./schemas/academy-schemas";

export async function RegisterEnrollmentPaymentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId, id } = idParamsSchema.parse(request.params);
    const body = enrollmentPaymentBodySchema.parse(request.body);

    const useCase = makeRegisterEnrollmentPaymentUseCase();
    const result = await useCase.execute({
      businessUnitId,
      enrollmentId: id,
      cashRegisterId: body.cashRegisterId,
      amount: body.amount,
      method: body.method,
      paymentType: body.paymentType,
      paidAt: body.paidAt,
    });

    return reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
