import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaCashRegistersRepository } from "@/repositories/prisma/prisma-cash-registers-repository";
import { PrismaWorkShiftsRepository } from "@/repositories/prisma/prisma-work-shifts-repository";
import { CloseCashRegisterUseCase } from "@/use-cases/close-cash-register-use-case";
import { handleControllerError } from "./handle-controller-error";

const closeCashRegisterParamsSchema = z.object({
  cashRegisterId: z.string().uuid(),
});

export async function closeCashRegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { cashRegisterId } = closeCashRegisterParamsSchema.parse(
    request.params,
  );

  try {
    const cashRegistersRepository = new PrismaCashRegistersRepository();
    const workShiftsRepository = new PrismaWorkShiftsRepository();

    const useCase = new CloseCashRegisterUseCase(
      cashRegistersRepository,
      workShiftsRepository,
    );

    const result = await useCase.execute({ cashRegisterId });

    reply.send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
