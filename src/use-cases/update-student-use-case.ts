import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  CreateStudentInput,
  StudentData,
  StudentsRepository,
} from "@/repositories/students-repository";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateStudentUseCaseRequest extends Partial<CreateStudentInput> {
  id: string;
  businessUnitId: string;
}

interface UpdateStudentUseCaseResponse {
  student: StudentData;
}

export class UpdateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    request: UpdateStudentUseCaseRequest,
  ): Promise<UpdateStudentUseCaseResponse> {
    const { id, businessUnitId, ...data } = request;
    const businessUnit =
      await this.businessUnitRepository.findById(businessUnitId);

    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const existingStudent = await this.studentsRepository.findById(id);

    if (!existingStudent || existingStudent.businessUnitId !== businessUnitId) {
      throw new ResourceNotFoundError("Student not found");
    }

    const student = await this.studentsRepository.update(id, {
      ...data,
      businessUnitId,
    });

    return { student };
  }
}
