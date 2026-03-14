import type {
  CreateSchoolYearInput,
  SchoolYearData,
  SchoolYearsRepository,
} from "@/repositories/school-years-repository";

interface CreateSchoolYearUseCaseResponse {
  schoolYear: SchoolYearData;
}

export class CreateSchoolYearUseCase {
  constructor(private schoolYearsRepository: SchoolYearsRepository) {}

  async execute(
    input: CreateSchoolYearInput,
  ): Promise<CreateSchoolYearUseCaseResponse> {
    const schoolYear = await this.schoolYearsRepository.create(input);
    return { schoolYear };
  }
}
