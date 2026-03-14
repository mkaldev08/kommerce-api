import type {
  EnrollmentData,
  EnrollmentsRepository,
} from "@/repositories/enrollments-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindEnrollmentByIdUseCaseResponse {
  enrollment: EnrollmentData;
}

export class FindEnrollmentByIdUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) {}

  async execute(id: string): Promise<FindEnrollmentByIdUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findById(id);
    if (!enrollment) {
      throw new ResourceNotFoundError("Enrollment not found");
    }
    return { enrollment };
  }
}
