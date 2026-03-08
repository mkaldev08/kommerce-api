import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaCashRegistersRepository } from "@/repositories/prisma/prisma-cash-registers-repository";
import { PrismaWorkShiftsRepository } from "@/repositories/prisma/prisma-work-shifts-repository";
import { OpenWorkShiftUseCase } from "@/use-cases/open-work-shift-use-case";
import { handleControllerError } from "./handle-controller-error";

const openWorkShiftBodySchema = z.object({
  cashRegisterId: z.string().uuid(),
  operatorId: z.string().uuid(),
  openingBalance: z.number().nonnegative(),
});

export async function openWorkShiftController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = openWorkShiftBodySchema.parse(request.body);

  try {
    const cashRegistersRepository = new PrismaCashRegistersRepository();
    const workShiftsRepository = new PrismaWorkShiftsRepository();

    const useCase = new OpenWorkShiftUseCase(
      cashRegistersRepository,
      workShiftsRepository,
    );

    const result = await useCase.execute(body);

    reply.status(201).send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
