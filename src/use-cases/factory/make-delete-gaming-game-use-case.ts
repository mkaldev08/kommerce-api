import { PrismaGamingGamesRepository } from "@/repositories/prisma/prisma-gaming-games-repository";
import { DeleteGamingGameUseCase } from "../delete-gaming-game-use-case";

export function makeDeleteGamingGameUseCase(): DeleteGamingGameUseCase {
  const gamingGamesRepository = new PrismaGamingGamesRepository();
  const useCase = new DeleteGamingGameUseCase(gamingGamesRepository);

  return useCase;
}
