import { PrismaInstructorsRepository } from "@/repositories/prisma/prisma-instructors-repository";
import { UpdateInstructorUseCase } from "../update-instructor-use-case";

export function makeUpdateInstructorUseCase(): UpdateInstructorUseCase {
  return new UpdateInstructorUseCase(new PrismaInstructorsRepository());
}
