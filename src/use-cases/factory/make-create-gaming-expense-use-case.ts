import { PrismaGamingExpensesRepository } from "@/repositories/prisma/prisma-gaming-expenses-repository";
import { CreateGamingExpenseUseCase } from "../create-gaming-expense-use-case";

export function makeCreateGamingExpenseUseCase(): CreateGamingExpenseUseCase {
  const gamingExpensesRepository = new PrismaGamingExpensesRepository();
  const useCase = new CreateGamingExpenseUseCase(gamingExpensesRepository);

  return useCase;
}
