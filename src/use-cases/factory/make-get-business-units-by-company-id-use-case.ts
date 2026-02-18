import { PrismaBusinessUnitRepository } from '@/repositories/prisma/prisma-business-unit-repository'
import { GetBusinessUnitsByCompanyIdUseCase } from '../get-business-units-by-company-id-use-case'

export function MakeGetBusinessUnitsByCompanyIdUseCase() {
  const businessUnitRepository = new PrismaBusinessUnitRepository()
  const useCase = new GetBusinessUnitsByCompanyIdUseCase(businessUnitRepository)

  return useCase
}
