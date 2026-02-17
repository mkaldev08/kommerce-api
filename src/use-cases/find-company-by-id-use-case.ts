import type { Company } from 'generated/prisma/client'
import type { CompaniesRepository } from '@/repositories/companies-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FindCompanyByIdUseCaseParams {
  companyId: string
}

interface FindCompanyByIdUseCaseResponse {
  company: Company
}

export class FindCompanyByIdUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute(
    params: FindCompanyByIdUseCaseParams,
  ): Promise<FindCompanyByIdUseCaseResponse> {
    const { companyId } = params

    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      throw new ResourceNotFoundError()
    }

    return {
      company,
    }
  }
}
