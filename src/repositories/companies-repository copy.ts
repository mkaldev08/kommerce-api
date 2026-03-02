export interface CompanySummary {
  id: string
}

export interface CompaniesRepository {
  findById(id: string): Promise<CompanySummary | null>
}
