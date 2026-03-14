import type {
  SchoolYearData,
  SchoolYearsRepository,
} from "@/repositories/school-years-repository";

interface ListSchoolYearsUseCaseResponse {
  schoolYears: SchoolYearData[];
}

export class ListSchoolYearsUseCase {
  constructor(private schoolYearsRepository: SchoolYearsRepository) {}

  async execute(): Promise<ListSchoolYearsUseCaseResponse> {
    const schoolYears = await this.schoolYearsRepository.findAll();
    return { schoolYears };
  }
}
