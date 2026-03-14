import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { ListStudentsUseCase } from "../list-students-use-case";

export function makeListStudentsUseCase(): ListStudentsUseCase {
  const studentsRepository = new PrismaStudentsRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();
  const useCase = new ListStudentsUseCase(
    studentsRepository,
    businessUnitRepository,
  );

  return useCase;
}
