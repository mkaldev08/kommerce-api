import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository";
import { FindCustomerByIdUseCase } from "../find-customer-by-id-use-case";

export function makeFindCustomerByIdUseCase(): FindCustomerByIdUseCase {
  const customersRepository = new PrismaCustomersRepository();
  const useCase = new FindCustomerByIdUseCase(customersRepository);

  return useCase;
}
