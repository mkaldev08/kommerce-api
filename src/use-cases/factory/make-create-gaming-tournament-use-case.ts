import { PrismaGamingTournamentsRepository } from "@/repositories/prisma/prisma-gaming-tournaments-repository";
import { CreateGamingTournamentUseCase } from "../create-gaming-tournament-use-case";

export function makeCreateGamingTournamentUseCase(): CreateGamingTournamentUseCase {
  const gamingTournamentsRepository = new PrismaGamingTournamentsRepository();
  const useCase = new CreateGamingTournamentUseCase(gamingTournamentsRepository);

  return useCase;
}
