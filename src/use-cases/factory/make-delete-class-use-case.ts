import { PrismaClassesRepository } from "@/repositories/prisma/prisma-classes-repository";
import { DeleteClassUseCase } from "../delete-class-use-case";

export function makeDeleteClassUseCase(): DeleteClassUseCase {
  return new DeleteClassUseCase(new PrismaClassesRepository());
}
