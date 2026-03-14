import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { FindStudentByIdUseCase } from "../find-student-by-id-use-case";

export function makeFindStudentByIdUseCase(): FindStudentByIdUseCase {
  const studentsRepository = new PrismaStudentsRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();
  const useCase = new FindStudentByIdUseCase(
    studentsRepository,
    businessUnitRepository,
  );

  return useCase;
}
