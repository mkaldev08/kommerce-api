import { PrismaGamingConsolesRepository } from "@/repositories/prisma/prisma-gaming-consoles-repository";
import { ListGamingConsolesUseCase } from "../list-gaming-consoles-use-case";

export function makeListGamingConsolesUseCase(): ListGamingConsolesUseCase {
  const gamingConsolesRepository = new PrismaGamingConsolesRepository();
  const useCase = new ListGamingConsolesUseCase(gamingConsolesRepository);

  return useCase;
}
