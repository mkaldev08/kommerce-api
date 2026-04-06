import { PrismaGamingExpensesRepository } from "@/repositories/prisma/prisma-gaming-expenses-repository";
import { ListGamingExpensesUseCase } from "../list-gaming-expenses-use-case";

export function makeListGamingExpensesUseCase(): ListGamingExpensesUseCase {
  const gamingExpensesRepository = new PrismaGamingExpensesRepository();
  const useCase = new ListGamingExpensesUseCase(gamingExpensesRepository);

  return useCase;
}
