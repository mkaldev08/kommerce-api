import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { UpdateStudentUseCase } from "../update-student-use-case";

export function makeUpdateStudentUseCase(): UpdateStudentUseCase {
  const studentsRepository = new PrismaStudentsRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();
  const useCase = new UpdateStudentUseCase(
    studentsRepository,
    businessUnitRepository,
  );

  return useCase;
}
