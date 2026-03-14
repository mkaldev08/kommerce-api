import { PrismaClassesRepository } from "@/repositories/prisma/prisma-classes-repository";
import { PrismaInstructorsRepository } from "@/repositories/prisma/prisma-instructors-repository";
import { PrismaSchoolYearsRepository } from "@/repositories/prisma/prisma-school-years-repository";
import { CreateClassUseCase } from "../create-class-use-case";

export function makeCreateClassUseCase(): CreateClassUseCase {
  return new CreateClassUseCase(
    new PrismaClassesRepository(),
    new PrismaInstructorsRepository(),
    new PrismaSchoolYearsRepository(),
  );
}
