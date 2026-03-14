import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type { StudentsRepository } from "@/repositories/students-repository";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteStudentUseCaseRequest {
  id: string;
  businessUnitId: string;
}

export class DeleteStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(request: DeleteStudentUseCaseRequest): Promise<void> {
    const businessUnit = await this.businessUnitRepository.findById(
      request.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const existingStudent = await this.studentsRepository.findById(request.id);

    if (
      !existingStudent ||
      existingStudent.businessUnitId !== request.businessUnitId
    ) {
      throw new ResourceNotFoundError("Student not found");
    }

    await this.studentsRepository.delete(request.id);
  }
}
