import type {
  BusinessUnitSummary,
  BusinessUnitsRepository,
} from '@/modules/store/application/ports/repositories/business-units-repository'

export class InMemoryBusinessUnitsRepository
  implements BusinessUnitsRepository
{
  items: BusinessUnitSummary[] = []

  async findById(id: string): Promise<BusinessUnitSummary | null> {
    return this.items.find((item) => item.id === id) ?? null
  }
}
