import { PrismaGamingConsolesRepository } from "@/repositories/prisma/prisma-gaming-consoles-repository";
import { UpdateGamingConsoleUseCase } from "../update-gaming-console-use-case";

export function makeUpdateGamingConsoleUseCase(): UpdateGamingConsoleUseCase {
  const gamingConsolesRepository = new PrismaGamingConsolesRepository();
  const useCase = new UpdateGamingConsoleUseCase(gamingConsolesRepository);

  return useCase;
}
