import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  CreateStudentInput,
  StudentData,
  StudentsRepository,
} from "@/repositories/students-repository";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateStudentUseCaseResponse {
  student: StudentData;
}

export class CreateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    input: CreateStudentInput,
  ): Promise<CreateStudentUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      input.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const student = await this.studentsRepository.create(input);

    return { student };
  }
}
