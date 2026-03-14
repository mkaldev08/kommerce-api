import { PrismaInstructorsRepository } from "@/repositories/prisma/prisma-instructors-repository";
import { PrismaBeltsRepository } from "@/repositories/prisma/prisma-belts-repository";
import { CreateInstructorUseCase } from "../create-instructor-use-case";

export function makeCreateInstructorUseCase(): CreateInstructorUseCase {
  return new CreateInstructorUseCase(
    new PrismaInstructorsRepository(),
    new PrismaBeltsRepository(),
  );
}
