import type { Municipality } from 'generated/prisma/client'

export interface MunicipalityRepository {
  findById(municipalityId: string): Promise<Municipality | null>
  findByProvinceId(provinceId: string): Promise<Municipality[]>
  findAll(): Promise<Municipality[]>
}
