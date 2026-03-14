import type {
  InstructorData,
  InstructorsRepository,
} from "@/repositories/instructors-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindInstructorByIdUseCaseResponse {
  instructor: InstructorData;
}

export class FindInstructorByIdUseCase {
  constructor(private instructorsRepository: InstructorsRepository) {}

  async execute(id: string): Promise<FindInstructorByIdUseCaseResponse> {
    const instructor = await this.instructorsRepository.findById(id);
    if (!instructor) {
      throw new ResourceNotFoundError("Instructor not found");
    }
    return { instructor };
  }
}
