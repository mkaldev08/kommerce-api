import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaGamingConsolesRepository } from "@/repositories/prisma/prisma-gaming-consoles-repository";
import { PrismaGamingCustomersRepository } from "@/repositories/prisma/prisma-gaming-customers-repository";
import { PrismaGamingGamesRepository } from "@/repositories/prisma/prisma-gaming-games-repository";
import { PrismaGamingSessionsRepository } from "@/repositories/prisma/prisma-gaming-sessions-repository";
import { StartGamingSessionUseCase } from "../start-gaming-session-use-case";

export function makeStartGamingSessionUseCase(): StartGamingSessionUseCase {
  const businessUnitRepository = new PrismaBusinessUnitRepository();
  const gamingCustomersRepository = new PrismaGamingCustomersRepository();
  const gamingConsolesRepository = new PrismaGamingConsolesRepository();
  const gamingGamesRepository = new PrismaGamingGamesRepository();
  const gamingSessionsRepository = new PrismaGamingSessionsRepository();

  const useCase = new StartGamingSessionUseCase(
    businessUnitRepository,
    gamingCustomersRepository,
    gamingConsolesRepository,
    gamingGamesRepository,
    gamingSessionsRepository,
  );

  return useCase;
}
