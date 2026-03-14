import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  StudentData,
  StudentsRepository,
} from "@/repositories/students-repository";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ListStudentsUseCaseRequest {
  businessUnitId: string;
}

interface ListStudentsUseCaseResponse {
  students: StudentData[];
}

export class ListStudentsUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    request: ListStudentsUseCaseRequest,
  ): Promise<ListStudentsUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      request.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const students = await this.studentsRepository.findManyByBusinessUnitId(
      request.businessUnitId,
    );

    return { students };
  }
}
