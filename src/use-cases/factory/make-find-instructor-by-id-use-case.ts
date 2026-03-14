import { PrismaInstructorsRepository } from "@/repositories/prisma/prisma-instructors-repository";
import { FindInstructorByIdUseCase } from "../find-instructor-by-id-use-case";

export function makeFindInstructorByIdUseCase(): FindInstructorByIdUseCase {
  return new FindInstructorByIdUseCase(new PrismaInstructorsRepository());
}
