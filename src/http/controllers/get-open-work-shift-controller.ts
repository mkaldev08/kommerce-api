import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaWorkShiftsRepository } from "@/repositories/prisma/prisma-work-shifts-repository";
import { GetOpenWorkShiftUseCase } from "@/use-cases/get-open-work-shift-use-case";
import { handleControllerError } from "./handle-controller-error";

const getOpenWorkShiftParamsSchema = z.object({
  cashRegisterId: z.string().uuid(),
});

export async function getOpenWorkShiftController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { cashRegisterId } = getOpenWorkShiftParamsSchema.parse(request.params);

  try {
    const workShiftsRepository = new PrismaWorkShiftsRepository();
    const useCase = new GetOpenWorkShiftUseCase(workShiftsRepository);

    const result = await useCase.execute({ cashRegisterId });

    reply.send(result);
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
