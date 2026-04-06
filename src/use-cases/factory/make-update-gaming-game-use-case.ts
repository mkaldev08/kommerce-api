import { PrismaGamingGamesRepository } from "@/repositories/prisma/prisma-gaming-games-repository";
import { UpdateGamingGameUseCase } from "../update-gaming-game-use-case";

export function makeUpdateGamingGameUseCase(): UpdateGamingGameUseCase {
  const gamingGamesRepository = new PrismaGamingGamesRepository();
  const useCase = new UpdateGamingGameUseCase(gamingGamesRepository);

  return useCase;
}
