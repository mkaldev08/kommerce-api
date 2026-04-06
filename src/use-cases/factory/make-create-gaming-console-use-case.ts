import { PrismaGamingConsolesRepository } from "@/repositories/prisma/prisma-gaming-consoles-repository";
import { CreateGamingConsoleUseCase } from "../create-gaming-console-use-case";

export function makeCreateGamingConsoleUseCase(): CreateGamingConsoleUseCase {
  const gamingConsolesRepository = new PrismaGamingConsolesRepository();
  const useCase = new CreateGamingConsoleUseCase(gamingConsolesRepository);

  return useCase;
}
