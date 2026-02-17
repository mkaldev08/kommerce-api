import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FindCompaniesByOwnerIdUseCase } from '../find-companies-by-owner-id-use-case'

export function MakeFindCompaniesByOwnerIdUseCase() {
  const companiesRepository = new PrismaCompaniesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new FindCompaniesByOwnerIdUseCase(
    companiesRepository,
    usersRepository,
  )

  return useCase
}
