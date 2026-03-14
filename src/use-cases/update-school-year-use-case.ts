import type {
  SchoolYearData,
  SchoolYearsRepository,
} from "@/repositories/school-years-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateSchoolYearInput {
  id: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

interface UpdateSchoolYearUseCaseResponse {
  schoolYear: SchoolYearData;
}

export class UpdateSchoolYearUseCase {
  constructor(private schoolYearsRepository: SchoolYearsRepository) {}

  async execute(
    input: UpdateSchoolYearInput,
  ): Promise<UpdateSchoolYearUseCaseResponse> {
    const existing = await this.schoolYearsRepository.findById(input.id);
    if (!existing) {
      throw new ResourceNotFoundError("School year not found");
    }

    const schoolYear = await this.schoolYearsRepository.update(input.id, {
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
    });
    return { schoolYear };
  }
}
