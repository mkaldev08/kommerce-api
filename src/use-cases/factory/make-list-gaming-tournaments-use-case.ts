import { PrismaGamingTournamentsRepository } from "@/repositories/prisma/prisma-gaming-tournaments-repository";
import { ListGamingTournamentsUseCase } from "../list-gaming-tournaments-use-case";

export function makeListGamingTournamentsUseCase(): ListGamingTournamentsUseCase {
  const gamingTournamentsRepository = new PrismaGamingTournamentsRepository();
  const useCase = new ListGamingTournamentsUseCase(gamingTournamentsRepository);

  return useCase;
}
