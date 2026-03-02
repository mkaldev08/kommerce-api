import type { BusinessUnitType } from '@/modules/store/domain/enums'

export interface BusinessUnitSummary {
  id: string
  companyId: string
  type: BusinessUnitType
}

export interface BusinessUnitsRepository {
  findById(id: string): Promise<BusinessUnitSummary | null>
}
