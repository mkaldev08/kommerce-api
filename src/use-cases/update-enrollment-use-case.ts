import type {
  EnrollmentData,
  EnrollmentsRepository,
} from "@/repositories/enrollments-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateEnrollmentInput {
  id: string;
  classId?: string;
  startDate?: Date;
  endDate?: Date | null;
}

interface UpdateEnrollmentUseCaseResponse {
  enrollment: EnrollmentData;
}

export class UpdateEnrollmentUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) {}

  async execute(
    input: UpdateEnrollmentInput,
  ): Promise<UpdateEnrollmentUseCaseResponse> {
    const existing = await this.enrollmentsRepository.findById(input.id);
    if (!existing) {
      throw new ResourceNotFoundError("Enrollment not found");
    }

    const enrollment = await this.enrollmentsRepository.update(input.id, {
      classId: input.classId,
      startDate: input.startDate,
      endDate: input.endDate,
    });
    return { enrollment };
  }
}
