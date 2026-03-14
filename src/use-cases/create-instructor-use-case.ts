import type {
  CreateInstructorInput,
  InstructorData,
  InstructorsRepository,
} from "@/repositories/instructors-repository";
import type { BeltsRepository } from "@/repositories/belts-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateInstructorUseCaseResponse {
  instructor: InstructorData;
}

export class CreateInstructorUseCase {
  constructor(
    private instructorsRepository: InstructorsRepository,
    private beltsRepository: BeltsRepository,
  ) {}

  async execute(
    input: CreateInstructorInput,
  ): Promise<CreateInstructorUseCaseResponse> {
    const belt = await this.beltsRepository.findById(input.beltId);
    if (!belt) {
      throw new ResourceNotFoundError("Belt not found");
    }

    const instructor = await this.instructorsRepository.create(input);
    return { instructor };
  }
}
