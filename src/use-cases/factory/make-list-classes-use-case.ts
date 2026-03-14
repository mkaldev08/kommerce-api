import { PrismaClassesRepository } from "@/repositories/prisma/prisma-classes-repository";
import { ListClassesUseCase } from "../list-classes-use-case";

export function makeListClassesUseCase(): ListClassesUseCase {
  return new ListClassesUseCase(new PrismaClassesRepository());
}
