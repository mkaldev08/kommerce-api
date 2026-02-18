import { PrismaBusinessUnitRepository } from '@/repositories/prisma/prisma-business-unit-repository'
import { GetBusinessUnitByIdUseCase } from '../get-business-unit-by-id-use-case'

export function MakeGetBusinessUnitByIdUseCase() {
  const businessUnitRepository = new PrismaBusinessUnitRepository()
  const useCase = new GetBusinessUnitByIdUseCase(businessUnitRepository)

  return useCase
}
