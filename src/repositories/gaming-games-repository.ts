export interface GamingGameData {
  id: string
  businessUnitId: string
  name: string
  genre?: string | null
  hourlyRate: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateGamingGameInput {
  businessUnitId: string
  name: string
  genre?: string | null
  hourlyRate: number
  isActive?: boolean
}

export interface GamingGamesRepository {
  create(data: CreateGamingGameInput): Promise<GamingGameData>
  findById(id: string): Promise<GamingGameData | null>
  findManyByBusinessUnitId(businessUnitId: string): Promise<GamingGameData[]>
  update(
    id: string,
    data: Partial<Omit<CreateGamingGameInput, 'businessUnitId'>>,
  ): Promise<GamingGameData>
  delete(id: string): Promise<void>
}
