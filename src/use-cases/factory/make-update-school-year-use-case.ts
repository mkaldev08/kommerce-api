import { PrismaSchoolYearsRepository } from "@/repositories/prisma/prisma-school-years-repository";
import { UpdateSchoolYearUseCase } from "../update-school-year-use-case";

export function makeUpdateSchoolYearUseCase(): UpdateSchoolYearUseCase {
  return new UpdateSchoolYearUseCase(new PrismaSchoolYearsRepository());
}
