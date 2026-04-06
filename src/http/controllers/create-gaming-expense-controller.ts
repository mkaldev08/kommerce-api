import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGamingExpenseUseCase } from "@/use-cases/factory/make-create-gaming-expense-use-case";
import { handleControllerError } from "./helpers/handle-controller-error";
import {
    createGamingExpenseBodySchema,
    gamingBusinessUnitParamsSchema,
} from "./schemas/gaming-house-schemas";

export async function CreateGamingExpenseController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(request.params);
    const body = createGamingExpenseBodySchema.parse(request.body);

    const useCase = makeCreateGamingExpenseUseCase();
    const result = await useCase.execute({
      businessUnitId,
      description: body.description,
      category: body.category || null,
      amount: body.amount,
      expenseDate: body.expenseDate,
      notes: body.notes || null,
    });

    return reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
