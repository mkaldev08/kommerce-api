import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository";
import { UpdateCustomerUseCase } from "../update-customer-use-case";

export function makeUpdateCustomerUseCase(): UpdateCustomerUseCase {
  const customersRepository = new PrismaCustomersRepository();
  const useCase = new UpdateCustomerUseCase(customersRepository);

  return useCase;
}
