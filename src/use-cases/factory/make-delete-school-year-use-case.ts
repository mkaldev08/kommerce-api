import { PrismaSchoolYearsRepository } from "@/repositories/prisma/prisma-school-years-repository";
import { DeleteSchoolYearUseCase } from "../delete-school-year-use-case";

export function makeDeleteSchoolYearUseCase(): DeleteSchoolYearUseCase {
  return new DeleteSchoolYearUseCase(new PrismaSchoolYearsRepository());
}
