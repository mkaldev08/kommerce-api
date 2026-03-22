import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { ListEnrollmentFinancialPlansUseCase } from "../list-enrollment-financial-plans-use-case";

export function makeListEnrollmentFinancialPlansUseCase(): ListEnrollmentFinancialPlansUseCase {
  return new ListEnrollmentFinancialPlansUseCase(
    new PrismaBusinessUnitRepository(),
  );
}
