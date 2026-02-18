import { PrismaProvinceRepository } from '@/repositories/prisma/prisma-province-repository'
import { GetAllProvincesUseCase } from '../get-all-provinces-use-case'

export function MakeGetAllProvincesUseCase() {
  const provinceRepository = new PrismaProvinceRepository()
  const useCase = new GetAllProvincesUseCase(provinceRepository)

  return useCase
}
