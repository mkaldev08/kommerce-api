import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaClassesRepository } from "@/repositories/prisma/prisma-classes-repository";
import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository";
import { PrismaStudentsRepository } from "@/repositories/prisma/prisma-students-repository";
import { CreateEnrollmentUseCase } from "../create-enrollment-use-case";

export function makeCreateEnrollmentUseCase(): CreateEnrollmentUseCase {
  return new CreateEnrollmentUseCase(
    new PrismaEnrollmentsRepository(),
    new PrismaStudentsRepository(),
    new PrismaClassesRepository(),
    new PrismaBusinessUnitRepository(),
  );
}
