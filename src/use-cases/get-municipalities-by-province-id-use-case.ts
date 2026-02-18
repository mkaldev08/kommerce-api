import type { Municipality } from 'generated/prisma/client'
import type { MunicipalityRepository } from '@/repositories/municipality-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetMunicipalitiesByProvinceIdUseCaseParams {
  provinceId: string
}

interface GetMunicipalitiesByProvinceIdUseCaseResponse {
  municipalities: Municipality[]
}

export class GetMunicipalitiesByProvinceIdUseCase {
  constructor(private municipalityRepository: MunicipalityRepository) {}

  async execute(
    params: GetMunicipalitiesByProvinceIdUseCaseParams,
  ): Promise<GetMunicipalitiesByProvinceIdUseCaseResponse> {
    const { provinceId } = params

    const municipalities =
      await this.municipalityRepository.findByProvinceId(provinceId)

    if (municipalities.length === 0) {
      throw new ResourceNotFoundError()
    }

    return {
      municipalities,
    }
  }
}
