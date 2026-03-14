import type {
  InstructorData,
  InstructorsRepository,
} from "@/repositories/instructors-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateInstructorInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string | null;
  beltId?: string;
}

interface UpdateInstructorUseCaseResponse {
  instructor: InstructorData;
}

export class UpdateInstructorUseCase {
  constructor(private instructorsRepository: InstructorsRepository) {}

  async execute(
    input: UpdateInstructorInput,
  ): Promise<UpdateInstructorUseCaseResponse> {
    const existing = await this.instructorsRepository.findById(input.id);
    if (!existing) {
      throw new ResourceNotFoundError("Instructor not found");
    }

    const instructor = await this.instructorsRepository.update(input.id, {
      name: input.name,
      email: input.email,
      phone: input.phone,
      beltId: input.beltId,
    });
    return { instructor };
  }
}
