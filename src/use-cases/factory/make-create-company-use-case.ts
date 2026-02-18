import { PrismaBusinessUnitRepository } from '@/repositories/prisma/prisma-business-unit-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateCompanyUseCase } from '../create-company-use-case'

export function MakeCreateCompanyUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const companiesRepository = new PrismaCompaniesRepository()
  const businessUnitRepository = new PrismaBusinessUnitRepository()
  const useCase = new CreateCompanyUseCase(
    usersRepository,
    companiesRepository,
    businessUnitRepository,
  )

  return useCase
}
