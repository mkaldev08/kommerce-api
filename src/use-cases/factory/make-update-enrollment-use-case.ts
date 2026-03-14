import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository";
import { UpdateEnrollmentUseCase } from "../update-enrollment-use-case";

export function makeUpdateEnrollmentUseCase(): UpdateEnrollmentUseCase {
  return new UpdateEnrollmentUseCase(new PrismaEnrollmentsRepository());
}
