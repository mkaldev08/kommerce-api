import type { Company } from 'generated/prisma/client'
import type { CompaniesRepository } from '@/repositories/companies-repository'
import type { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FindCompaniesByOwnerIdUseCaseParams {
  ownerId: string
}

interface FindCompaniesByOwnerIdUseCaseResponse {
  companies: Company[]
}

export class FindCompaniesByOwnerIdUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    params: FindCompaniesByOwnerIdUseCaseParams,
  ): Promise<FindCompaniesByOwnerIdUseCaseResponse> {
    const { ownerId } = params

    const user = await this.usersRepository.findById(ownerId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const companies = await this.companiesRepository.findAllByOwnerId(ownerId)

    return {
      companies,
    }
  }
}
