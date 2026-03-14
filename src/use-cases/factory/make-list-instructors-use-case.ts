import { PrismaInstructorsRepository } from "@/repositories/prisma/prisma-instructors-repository";
import { ListInstructorsUseCase } from "../list-instructors-use-case";

export function makeListInstructorsUseCase(): ListInstructorsUseCase {
  return new ListInstructorsUseCase(new PrismaInstructorsRepository());
}
