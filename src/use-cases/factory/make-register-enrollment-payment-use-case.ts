import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaCashMovementsRepository } from "@/repositories/prisma/prisma-cash-movements-repository";
import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository";
import { PrismaInvoicesRepository } from "@/repositories/prisma/prisma-invoices-repository";
import { PrismaPaymentsRepository } from "@/repositories/prisma/prisma-payments-repository";
import { RegisterEnrollmentPaymentUseCase } from "../register-enrollment-payment-use-case";

export function makeRegisterEnrollmentPaymentUseCase(): RegisterEnrollmentPaymentUseCase {
  return new RegisterEnrollmentPaymentUseCase(
    new PrismaBusinessUnitRepository(),
    new PrismaEnrollmentsRepository(),
    new PrismaInvoicesRepository(),
    new PrismaPaymentsRepository(),
    new PrismaCashMovementsRepository(),
  );
}
