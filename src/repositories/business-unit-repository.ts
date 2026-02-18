import type { BusinessUnit } from 'generated/prisma/client'

export interface BusinessUnitRepository {
  findById(businessUnitId: string): Promise<BusinessUnit | null>
  findByCompanyId(companyId: string): Promise<BusinessUnit[]>
  create(
    data: Omit<BusinessUnit, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<BusinessUnit>
}
