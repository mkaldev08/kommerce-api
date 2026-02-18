import { PrismaMunicipalityRepository } from '@/repositories/prisma/prisma-municipality-repository'
import { GetMunicipalitiesByProvinceIdUseCase } from '../get-municipalities-by-province-id-use-case'

export function MakeGetMunicipalitiesByProvinceIdUseCase() {
  const municipalityRepository = new PrismaMunicipalityRepository()
  const useCase = new GetMunicipalitiesByProvinceIdUseCase(
    municipalityRepository,
  )

  return useCase
}
