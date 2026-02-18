import type { BusinessUnit } from 'generated/prisma/client'
import type { BusinessUnitRepository } from '@/repositories/business-unit-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetBusinessUnitsByCompanyIdUseCaseParams {
  companyId: string
}

interface GetBusinessUnitsByCompanyIdUseCaseResponse {
  businessUnits: BusinessUnit[]
}

export class GetBusinessUnitsByCompanyIdUseCase {
  constructor(private businessUnitRepository: BusinessUnitRepository) {}

  async execute(
    params: GetBusinessUnitsByCompanyIdUseCaseParams,
  ): Promise<GetBusinessUnitsByCompanyIdUseCaseResponse> {
    const { companyId } = params

    const businessUnits =
      await this.businessUnitRepository.findByCompanyId(companyId)

    if (businessUnits.length === 0) {
      throw new ResourceNotFoundError()
    }

    return {
      businessUnits,
    }
  }
}
