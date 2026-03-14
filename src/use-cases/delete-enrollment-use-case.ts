import type { EnrollmentsRepository } from "@/repositories/enrollments-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DeleteEnrollmentUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.enrollmentsRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError("Enrollment not found");
    }
    await this.enrollmentsRepository.delete(id);
  }
}
