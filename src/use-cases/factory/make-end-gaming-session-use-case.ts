import { PrismaGamingConsolesRepository } from "@/repositories/prisma/prisma-gaming-consoles-repository";
import { PrismaGamingSessionsRepository } from "@/repositories/prisma/prisma-gaming-sessions-repository";
import { EndGamingSessionUseCase } from "../end-gaming-session-use-case";

export function makeEndGamingSessionUseCase(): EndGamingSessionUseCase {
  const gamingSessionsRepository = new PrismaGamingSessionsRepository();
  const gamingConsolesRepository = new PrismaGamingConsolesRepository();
  const useCase = new EndGamingSessionUseCase(
    gamingSessionsRepository,
    gamingConsolesRepository,
  );

  return useCase;
}
