import type {
  EnrollmentData,
  EnrollmentsRepository,
} from "@/repositories/enrollments-repository";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { BusinessUnitNotAcademyError } from "./errors/business-unit-not-academy-error";

interface ListEnrollmentsUseCaseResponse {
  enrollments: EnrollmentData[];
}

export class ListEnrollmentsUseCase {
  constructor(
    private enrollmentsRepository: EnrollmentsRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    businessUnitId: string,
  ): Promise<ListEnrollmentsUseCaseResponse> {
    const businessUnit =
      await this.businessUnitRepository.findById(businessUnitId);
    if (!businessUnit) {
      throw new ResourceNotFoundError("Business unit not found");
    }
    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const enrollments =
      await this.enrollmentsRepository.findManyByBusinessUnitId(businessUnitId);
    return { enrollments };
  }
}
