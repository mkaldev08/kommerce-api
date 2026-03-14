import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { DeleteStudentUseCase } from "../delete-student-use-case";

export function makeDeleteStudentUseCase(): DeleteStudentUseCase {
  const studentsRepository = new PrismaStudentsRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();
  const useCase = new DeleteStudentUseCase(
    studentsRepository,
    businessUnitRepository,
  );

  return useCase;
}
