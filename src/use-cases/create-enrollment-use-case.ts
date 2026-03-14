import type {
  CreateEnrollmentInput,
  EnrollmentData,
  EnrollmentsRepository,
} from "@/repositories/enrollments-repository";
import type { StudentsRepository } from "@/repositories/students-repository";
import type { ClassesRepository } from "@/repositories/classes-repository";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";

interface CreateEnrollmentUseCaseResponse {
  enrollment: EnrollmentData;
}

export class CreateEnrollmentUseCase {
  constructor(
    private enrollmentsRepository: EnrollmentsRepository,
    private studentsRepository: StudentsRepository,
    private classesRepository: ClassesRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    input: CreateEnrollmentInput,
  ): Promise<CreateEnrollmentUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      input.businessUnitId,
    );
    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }
    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const student = await this.studentsRepository.findById(input.studentId);
    if (!student) {
      throw new ResourceNotFoundError();
    }

    const cls = await this.classesRepository.findById(input.classId);
    if (!cls) {
      throw new ResourceNotFoundError();
    }

    const enrollment = await this.enrollmentsRepository.create(input);
    return { enrollment };
  }
}
