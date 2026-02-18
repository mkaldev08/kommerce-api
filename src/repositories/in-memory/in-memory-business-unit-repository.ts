import type { BusinessUnit } from 'generated/prisma/client'
import type { BusinessUnitRepository } from '../business-unit-repository'

export class InMemoryBusinessUnitRepository implements BusinessUnitRepository {
  private items: BusinessUnit[] = []

  async findById(businessUnitId: string): Promise<BusinessUnit | null> {
    const businessUnit = this.items.find((item) => item.id === businessUnitId)
    return businessUnit ?? null
  }

  async findByCompanyId(companyId: string): Promise<BusinessUnit[]> {
    return this.items.filter((item) => item.company_id === companyId)
  }

  async create(
    data: Omit<BusinessUnit, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<BusinessUnit> {
    const businessUnit: BusinessUnit = {
      id: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      ...data,
    }

    this.items.push(businessUnit)

    return businessUnit
  }
}
