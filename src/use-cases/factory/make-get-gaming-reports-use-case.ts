import { PrismaGamingReportsRepository } from "@/repositories/prisma/prisma-gaming-reports-repository";
import { GetGamingReportsUseCase } from "../get-gaming-reports-use-case";

export function makeGetGamingReportsUseCase(): GetGamingReportsUseCase {
  const gamingReportsRepository = new PrismaGamingReportsRepository();
  const useCase = new GetGamingReportsUseCase(gamingReportsRepository);

  return useCase;
}
