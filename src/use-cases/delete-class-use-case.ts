import type { ClassesRepository } from "@/repositories/classes-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DeleteClassUseCase {
  constructor(private classesRepository: ClassesRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.classesRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError("Class not found");
    }
    await this.classesRepository.delete(id);
  }
}
