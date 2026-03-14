import { PrismaSchoolYearsRepository } from "@/repositories/prisma/prisma-school-years-repository";
import { ListSchoolYearsUseCase } from "../list-school-years-use-case";

export function makeListSchoolYearsUseCase(): ListSchoolYearsUseCase {
  return new ListSchoolYearsUseCase(new PrismaSchoolYearsRepository());
}
