import type {
  InstructorData,
  InstructorsRepository,
} from "@/repositories/instructors-repository";

interface ListInstructorsUseCaseResponse {
  instructors: InstructorData[];
}

export class ListInstructorsUseCase {
  constructor(private instructorsRepository: InstructorsRepository) {}

  async execute(): Promise<ListInstructorsUseCaseResponse> {
    const instructors = await this.instructorsRepository.findAll();
    return { instructors };
  }
}
