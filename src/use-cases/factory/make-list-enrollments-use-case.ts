import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository";
import { ListEnrollmentsUseCase } from "../list-enrollments-use-case";

export function makeListEnrollmentsUseCase(): ListEnrollmentsUseCase {
  return new ListEnrollmentsUseCase(
    new PrismaEnrollmentsRepository(),
    new PrismaBusinessUnitRepository(),
  );
}
