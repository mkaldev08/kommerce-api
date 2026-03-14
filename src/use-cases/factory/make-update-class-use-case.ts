import { PrismaClassesRepository } from "@/repositories/prisma/prisma-classes-repository";
import { UpdateClassUseCase } from "../update-class-use-case";

export function makeUpdateClassUseCase(): UpdateClassUseCase {
  return new UpdateClassUseCase(new PrismaClassesRepository());
}
