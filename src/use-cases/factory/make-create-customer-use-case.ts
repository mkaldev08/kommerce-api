import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository";
import { CreateCustomerUseCase } from "../create-customer-use-case";

export function makeCreateCustomerUseCase(): CreateCustomerUseCase {
  const customersRepository = new PrismaCustomersRepository();
  const useCase = new CreateCustomerUseCase(customersRepository);

  return useCase;
}
