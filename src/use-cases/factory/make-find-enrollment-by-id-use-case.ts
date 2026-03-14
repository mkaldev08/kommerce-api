import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository";
import { FindEnrollmentByIdUseCase } from "../find-enrollment-by-id-use-case";

export function makeFindEnrollmentByIdUseCase(): FindEnrollmentByIdUseCase {
  return new FindEnrollmentByIdUseCase(new PrismaEnrollmentsRepository());
}
