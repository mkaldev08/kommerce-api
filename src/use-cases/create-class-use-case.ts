import type {
  ClassData,
  ClassesRepository,
  CreateClassInput,
} from "@/repositories/classes-repository";
import type { InstructorsRepository } from "@/repositories/instructors-repository";
import type { SchoolYearsRepository } from "@/repositories/school-years-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateClassUseCaseResponse {
  class: ClassData;
}

export class CreateClassUseCase {
  constructor(
    private classesRepository: ClassesRepository,
    private instructorsRepository: InstructorsRepository,
    private schoolYearsRepository: SchoolYearsRepository,
  ) {}

  async execute(input: CreateClassInput): Promise<CreateClassUseCaseResponse> {
    const instructor = await this.instructorsRepository.findById(
      input.instructorId,
    );
    if (!instructor) {
      throw new ResourceNotFoundError("Instructor not found");
    }

    const schoolYear = await this.schoolYearsRepository.findById(
      input.schoolYearId,
    );
    if (!schoolYear) {
      throw new ResourceNotFoundError("School year not found");
    }

    const cls = await this.classesRepository.create(input);
    return { class: cls };
  }
}
