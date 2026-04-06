import { PrismaGamingCustomersRepository } from "@/repositories/prisma/prisma-gaming-customers-repository";
import { CreateGamingCustomerUseCase } from "../create-gaming-customer-use-case";

export function makeCreateGamingCustomerUseCase(): CreateGamingCustomerUseCase {
  const gamingCustomersRepository = new PrismaGamingCustomersRepository();
  const useCase = new CreateGamingCustomerUseCase(gamingCustomersRepository);

  return useCase;
}
