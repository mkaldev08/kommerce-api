import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository";
import { DeleteEnrollmentUseCase } from "../delete-enrollment-use-case";

export function makeDeleteEnrollmentUseCase(): DeleteEnrollmentUseCase {
  return new DeleteEnrollmentUseCase(new PrismaEnrollmentsRepository());
}
