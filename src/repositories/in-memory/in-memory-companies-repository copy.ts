import type {
  CompaniesRepository,
  CompanySummary,
} from '@/modules/store/application/ports/repositories/companies-repository'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  items: CompanySummary[] = []

  async findById(id: string): Promise<CompanySummary | null> {
    return this.items.find((item) => item.id === id) ?? null
  }
}
