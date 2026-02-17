import type { Company } from 'generated/prisma/client'
import type { CompaniesRepository } from '@/repositories/companies-repository'
import type { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FindOneCompanyByOwnerIdUseCaseParams {
  ownerId: string
}

interface FindOneCompanyByOwnerIdUseCaseResponse {
  company: Company
}

export class FindOneCompanyByOwnerIdUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    params: FindOneCompanyByOwnerIdUseCaseParams,
  ): Promise<FindOneCompanyByOwnerIdUseCaseResponse> {
    const { ownerId } = params

    const user = await this.usersRepository.findById(ownerId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const company = await this.companiesRepository.findOneByOwnerId(ownerId)

    if (!company) {
      throw new ResourceNotFoundError()
    }

    return {
      company,
    }
  }
}
