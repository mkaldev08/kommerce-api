import { PrismaGamingCustomersRepository } from "@/repositories/prisma/prisma-gaming-customers-repository";
import { ListGamingCustomersUseCase } from "../list-gaming-customers-use-case";

export function makeListGamingCustomersUseCase(): ListGamingCustomersUseCase {
  const gamingCustomersRepository = new PrismaGamingCustomersRepository();
  const useCase = new ListGamingCustomersUseCase(gamingCustomersRepository);

  return useCase;
}
