import { PrismaGamingCustomersRepository } from "@/repositories/prisma/prisma-gaming-customers-repository";
import { DeleteGamingCustomerUseCase } from "../delete-gaming-customer-use-case";

export function makeDeleteGamingCustomerUseCase(): DeleteGamingCustomerUseCase {
  const gamingCustomersRepository = new PrismaGamingCustomersRepository();
  const useCase = new DeleteGamingCustomerUseCase(gamingCustomersRepository);

  return useCase;
}
