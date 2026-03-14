import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { CreateStudentUseCase } from "../create-student-use-case";

export function makeCreateStudentUseCase(): CreateStudentUseCase {
  const studentsRepository = new PrismaStudentsRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();
  const useCase = new CreateStudentUseCase(
    studentsRepository,
    businessUnitRepository,
  );

  return useCase;
}
