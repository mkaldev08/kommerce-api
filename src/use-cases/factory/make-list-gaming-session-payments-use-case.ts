import { PrismaGamingSessionPaymentsRepository } from "@/repositories/prisma/prisma-gaming-session-payments-repository";
import { ListGamingSessionPaymentsUseCase } from "../list-gaming-session-payments-use-case";

export function makeListGamingSessionPaymentsUseCase(): ListGamingSessionPaymentsUseCase {
  const gamingSessionPaymentsRepository = new PrismaGamingSessionPaymentsRepository();
  const useCase = new ListGamingSessionPaymentsUseCase(
    gamingSessionPaymentsRepository,
  );

  return useCase;
}
