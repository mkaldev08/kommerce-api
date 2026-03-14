import type { InstructorsRepository } from "@/repositories/instructors-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DeleteInstructorUseCase {
  constructor(private instructorsRepository: InstructorsRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.instructorsRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError("Instructor not found");
    }
    await this.instructorsRepository.delete(id);
  }
}
