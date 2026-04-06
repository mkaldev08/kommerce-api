import { PrismaGamingCustomersRepository } from "@/repositories/prisma/prisma-gaming-customers-repository";
import { UpdateGamingCustomerUseCase } from "../update-gaming-customer-use-case";

export function makeUpdateGamingCustomerUseCase(): UpdateGamingCustomerUseCase {
  const gamingCustomersRepository = new PrismaGamingCustomersRepository();
  const useCase = new UpdateGamingCustomerUseCase(gamingCustomersRepository);

  return useCase;
}
