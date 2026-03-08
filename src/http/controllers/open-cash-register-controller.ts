import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaCashRegistersRepository } from "@/repositories/prisma/prisma-cash-registers-repository";
import { OpenCashRegisterUseCase } from "@/use-cases/open-cash-register-use-case";
import { handleControllerError } from "./handle-controller-error";

const openCashRegisterBodySchema = z.object({
  businessUnitId: z.string().uuid(),
  operatorId: z.string().uuid(),
});

export async function openCashRegisterController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const body = openCashRegisterBodySchema.parse(request.body);

  try {
    const businessUnitRepository = new PrismaBusinessUnitRepository();
    const cashRegistersRepository = new PrismaCashRegistersRepository();

    const useCase = new OpenCashRegisterUseCase(
      businessUnitRepository,
      cashRegistersRepository,
    );

    const { cashRegisterId } = await useCase.execute(body);

    reply.status(201).send({ cashRegisterId });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
