import type { BusinessUnit } from "../../generated/prisma/client";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetBusinessUnitByIdUseCaseParams {
  businessUnitId: string;
}

interface GetBusinessUnitByIdUseCaseResponse {
  businessUnit: BusinessUnit;
}

export class GetBusinessUnitByIdUseCase {
  constructor(private businessUnitRepository: BusinessUnitRepository) {}

  async execute(
    params: GetBusinessUnitByIdUseCaseParams,
  ): Promise<GetBusinessUnitByIdUseCaseResponse> {
    const { businessUnitId } = params;

    const businessUnit =
      await this.businessUnitRepository.findById(businessUnitId);

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    return {
      businessUnit,
    };
  }
}
