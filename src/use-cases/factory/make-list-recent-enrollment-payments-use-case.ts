import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { ListRecentEnrollmentPaymentsUseCase } from "../list-recent-enrollment-payments-use-case";

export function makeListRecentEnrollmentPaymentsUseCase(): ListRecentEnrollmentPaymentsUseCase {
  return new ListRecentEnrollmentPaymentsUseCase(
    new PrismaBusinessUnitRepository(),
  );
}
