import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaCashMovementsRepository } from "@/repositories/prisma/prisma-cash-movements-repository";
import { PrismaCashRegistersRepository } from "@/repositories/prisma/prisma-cash-registers-repository";
import { PrismaWorkShiftsRepository } from "@/repositories/prisma/prisma-work-shifts-repository";
import { CalculateCashBalanceUseCase } from "@/use-cases/calculate-cash-balance-use-case";
import { CloseWorkShiftUseCase } from "@/use-cases/close-work-shift-use-case";
import { handleControllerError } from "./handle-controller-error";

const closeWorkShiftParamsSchema = z.object({
  workShiftId: z.string().uuid(),
});

const closeWorkShiftBodySchema = z.object({
  closingBalance: z.number().nonnegative(),
});

export async function closeWorkShiftController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { workShiftId } = closeWorkShiftParamsSchema.parse(request.params);
  const body = closeWorkShiftBodySchema.parse(request.body);

  try {
    const cashRegistersRepository = new PrismaCashRegistersRepository();
    const workShiftsRepository = new PrismaWorkShiftsRepository();
    const cashMovementsRepository = new PrismaCashMovementsRepository();
    const calculateCashBalanceUseCase = new CalculateCashBalanceUseCase(
      cashMovementsRepository,
    );

    const useCase = new CloseWorkShiftUseCase(
      cashRegistersRepository,
      workShiftsRepository,
      calculateCashBalanceUseCase,
    );

    const result = await useCase.execute({
      workShiftId,
      closingBalance: body.closingBalance,
    });

    reply.send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
