import { PrismaInstructorsRepository } from "@/repositories/prisma/prisma-instructors-repository";
import { DeleteInstructorUseCase } from "../delete-instructor-use-case";

export function makeDeleteInstructorUseCase(): DeleteInstructorUseCase {
  return new DeleteInstructorUseCase(new PrismaInstructorsRepository());
}
