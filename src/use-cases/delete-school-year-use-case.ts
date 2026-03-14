import type { SchoolYearsRepository } from "@/repositories/school-years-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DeleteSchoolYearUseCase {
  constructor(private schoolYearsRepository: SchoolYearsRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.schoolYearsRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError("School year not found");
    }
    await this.schoolYearsRepository.delete(id);
  }
}
