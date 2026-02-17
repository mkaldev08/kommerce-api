import type { Company } from 'generated/prisma/client'
import type { CompaniesRepository } from '@/repositories/companies-repository'
import type { UsersRepository } from '@/repositories/users-repository'
import { CompanyAlreadyExistsError } from './errors/company-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export enum Regime {
  SIMPLIFICADO = 'SIMPLIFICADO',
  EXCLUSAO = 'EXCLUSAO',
  GERAL = 'GERAL',
}

interface CreateCompanyUseCaseParams {
  id?: string
  name: string
  created_at?: Date | string
  nif: string
  social_reason: string
  registration_number: string
  website?: string | null
  updated_at?: Date | string
  regime?: Regime
  document_code: string
  social_capital?: number
  user_owner_id: string
  email: string
  phone_number: string
  street: string
  zip_code?: string | null
  municipality_id: string
}

interface CreateCompanyUseCaseResponse {
  company: Company
}

export class CreateCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute(
    params: CreateCompanyUseCaseParams,
  ): Promise<CreateCompanyUseCaseResponse> {
    const [
      user,
      existingCompany,
      existingCompanyByEmail,
      existingCompanyByPhoneNumber,
    ] = await Promise.all([
      this.usersRepository.findById(params.user_owner_id),
      this.companiesRepository.findByNif(params.nif),
      this.companiesRepository.findByEmail(params.email),
      this.companiesRepository.findByPhoneNumber(params.phone_number),
    ])

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (
      existingCompany ||
      existingCompanyByEmail ||
      existingCompanyByPhoneNumber
    ) {
      throw new CompanyAlreadyExistsError()
    }

    const company = await this.companiesRepository.create({
      ...params,
      regime: params.regime ?? Regime.SIMPLIFICADO,
      user_owner_id: user.id,
    })

    return {
      company,
    }
  }
}
