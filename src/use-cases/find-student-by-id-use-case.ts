import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  StudentData,
  StudentsRepository,
} from "@/repositories/students-repository";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindStudentByIdUseCaseRequest {
  id: string;
  businessUnitId: string;
}

interface FindStudentByIdUseCaseResponse {
  student: StudentData;
}

export class FindStudentByIdUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    request: FindStudentByIdUseCaseRequest,
  ): Promise<FindStudentByIdUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      request.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const student = await this.studentsRepository.findById(request.id);

    if (!student || student.businessUnitId !== request.businessUnitId) {
      throw new ResourceNotFoundError("Student not found");
    }

    return { student };
  }
}
