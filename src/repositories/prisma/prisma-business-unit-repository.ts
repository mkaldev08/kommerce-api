import type { BusinessUnit } from 'generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { BusinessUnitRepository } from '../business-unit-repository'

export class PrismaBusinessUnitRepository implements BusinessUnitRepository {
  async findById(businessUnitId: string): Promise<BusinessUnit | null> {
    const businessUnit = await prisma.businessUnit.findUnique({
      where: { id: businessUnitId },
    })
    return businessUnit
  }

  async findByCompanyId(companyId: string): Promise<BusinessUnit[]> {
    const businessUnits = await prisma.businessUnit.findMany({
      where: { company_id: companyId },
    })
    return businessUnits
  }

  async create(
    data: Omit<BusinessUnit, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<BusinessUnit> {
    const businessUnit = await prisma.businessUnit.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        address: data.address,
        company_id: data.company_id,
      },
    })
    return businessUnit
  }
}
