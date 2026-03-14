import { PrismaClassesRepository } from "@/repositories/prisma/prisma-classes-repository";
import { FindClassByIdUseCase } from "../find-class-by-id-use-case";

export function makeFindClassByIdUseCase(): FindClassByIdUseCase {
  return new FindClassByIdUseCase(new PrismaClassesRepository());
}
