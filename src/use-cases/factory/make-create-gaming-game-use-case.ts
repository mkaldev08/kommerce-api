import { PrismaGamingGamesRepository } from "@/repositories/prisma/prisma-gaming-games-repository";
import { CreateGamingGameUseCase } from "../create-gaming-game-use-case";

export function makeCreateGamingGameUseCase(): CreateGamingGameUseCase {
  const gamingGamesRepository = new PrismaGamingGamesRepository();
  const useCase = new CreateGamingGameUseCase(gamingGamesRepository);

  return useCase;
}
