import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { FindCompanyByIdUseCase } from '../find-company-by-id-use-case'

export function MakeFindCompanyByIdUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  const useCase = new FindCompanyByIdUseCase(companiesRepository)

  return useCase
}
