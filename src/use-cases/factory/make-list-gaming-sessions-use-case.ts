import { PrismaGamingSessionsRepository } from "@/repositories/prisma/prisma-gaming-sessions-repository";
import { ListGamingSessionsUseCase } from "../list-gaming-sessions-use-case";

export function makeListGamingSessionsUseCase(): ListGamingSessionsUseCase {
  const gamingSessionsRepository = new PrismaGamingSessionsRepository();
  const useCase = new ListGamingSessionsUseCase(gamingSessionsRepository);

  return useCase;
}
