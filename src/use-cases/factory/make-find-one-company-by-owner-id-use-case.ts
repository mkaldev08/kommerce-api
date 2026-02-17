import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FindOneCompanyByOwnerIdUseCase } from '../find-one-company-by-owner-id-use-case'

export function MakeFindOneCompanyByOwnerIdUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new FindOneCompanyByOwnerIdUseCase(
    companiesRepository,
    usersRepository,
  )

  return useCase
}
