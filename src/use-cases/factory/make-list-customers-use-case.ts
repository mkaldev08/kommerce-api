import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository";
import { ListCustomersUseCase } from "../list-customers-use-case";

export function makeListCustomersUseCase(): ListCustomersUseCase {
  const customersRepository = new PrismaCustomersRepository();
  const useCase = new ListCustomersUseCase(customersRepository);

  return useCase;
}
