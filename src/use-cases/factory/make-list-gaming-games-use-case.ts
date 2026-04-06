import { PrismaGamingGamesRepository } from "@/repositories/prisma/prisma-gaming-games-repository";
import { ListGamingGamesUseCase } from "../list-gaming-games-use-case";

export function makeListGamingGamesUseCase(): ListGamingGamesUseCase {
  const gamingGamesRepository = new PrismaGamingGamesRepository();
  const useCase = new ListGamingGamesUseCase(gamingGamesRepository);

  return useCase;
}
