import type { Company } from 'generated/prisma/client'
import type { CompanyUncheckedCreateInput } from 'generated/prisma/models'
import { Regime } from '@/use-cases/create-company-use-case'
import type { CompaniesRepository } from '../companies-repository'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) || null
  }
  async findByPhoneNumber(phoneNumber: string) {
    return this.items.find((item) => item.phone_number === phoneNumber) || null
  }
  async findAllByOwnerId(ownerId: string) {
    return this.items.filter((item) => item.user_owner_id === ownerId)
  }
  async findByNif(nif: string) {
    return this.items.find((item) => item.nif === nif) || null
  }
  private items: Company[] = []
  async findById(companyId: string) {
    const company = this.items.find((item) => item.id === companyId)

    if (!company) return null
    return company
  }

  async create(data: CompanyUncheckedCreateInput) {
    const company: Company = {
      id: data.id ?? crypto.randomUUID(),
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
      website: data.website ?? null,
      regime: data.regime ?? Regime.SIMPLIFICADO,
      social_capital: data.social_capital ?? 0,
      zip_code: data.zip_code ?? null,
    }
    this.items.push(company)
    return company
  }
  async findOneByOwnerId(ownerId: string): Promise<Company | null> {
    const company = this.items.find((item) => item.user_owner_id === ownerId)
    return company || null
  }
}
