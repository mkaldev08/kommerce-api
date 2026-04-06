import { PrismaGamingConsolesRepository } from "@/repositories/prisma/prisma-gaming-consoles-repository";
import { DeleteGamingConsoleUseCase } from "../delete-gaming-console-use-case";

export function makeDeleteGamingConsoleUseCase(): DeleteGamingConsoleUseCase {
  const gamingConsolesRepository = new PrismaGamingConsolesRepository();
  const useCase = new DeleteGamingConsoleUseCase(gamingConsolesRepository);

  return useCase;
}
