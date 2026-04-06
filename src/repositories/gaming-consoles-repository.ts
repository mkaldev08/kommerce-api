import type { GamingConsoleStatus } from 'generated/prisma/enums'

export interface GamingConsoleData {
  id: string
  businessUnitId: string
  name: string
  brand?: string | null
  model?: string | null
  hourlyRate: number
  status: GamingConsoleStatus
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateGamingConsoleInput {
  businessUnitId: string
  name: string
  brand?: string | null
  model?: string | null
  hourlyRate?: number
  status?: GamingConsoleStatus
  isActive?: boolean
}

export interface GamingConsolesRepository {
  create(data: CreateGamingConsoleInput): Promise<GamingConsoleData>
  findById(id: string): Promise<GamingConsoleData | null>
  findManyByBusinessUnitId(businessUnitId: string): Promise<GamingConsoleData[]>
  update(
    id: string,
    data: Partial<Omit<CreateGamingConsoleInput, 'businessUnitId'>>,
  ): Promise<GamingConsoleData>
  updateStatus(
    id: string,
    status: GamingConsoleStatus,
  ): Promise<GamingConsoleData>
  delete(id: string): Promise<void>
}
