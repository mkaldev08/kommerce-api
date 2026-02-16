import type { Province } from 'generated/prisma/client'

export interface ProvinceRepository {
  findById(provinceId: string): Promise<Province | null>
  findAll(): Promise<Province[]>
}
