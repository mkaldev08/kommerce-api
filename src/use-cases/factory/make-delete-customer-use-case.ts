import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository";
import { DeleteCustomerUseCase } from "../delete-customer-use-case";

export function makeDeleteCustomerUseCase(): DeleteCustomerUseCase {
  const customersRepository = new PrismaCustomersRepository();
  const useCase = new DeleteCustomerUseCase(customersRepository);

  return useCase;
}
