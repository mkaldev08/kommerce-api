import { PrismaSchoolYearsRepository } from "@/repositories/prisma/prisma-school-years-repository";
import { CreateSchoolYearUseCase } from "../create-school-year-use-case";

export function makeCreateSchoolYearUseCase(): CreateSchoolYearUseCase {
  return new CreateSchoolYearUseCase(new PrismaSchoolYearsRepository());
}
