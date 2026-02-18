import type { Municipality } from 'generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { MunicipalityRepository } from '../municipality-repository'

export class PrismaMunicipalityRepository implements MunicipalityRepository {
  async findById(municipalityId: string): Promise<Municipality | null> {
    const municipality = await prisma.municipality.findUnique({
      where: { id: municipalityId },
    })
    return municipality
  }

  async findByProvinceId(provinceId: string): Promise<Municipality[]> {
    const municipalities = await prisma.municipality.findMany({
      where: { province_id: provinceId },
    })
    return municipalities
  }

  async findAll(): Promise<Municipality[]> {
    const municipalities = await prisma.municipality.findMany()
    return municipalities
  }
}
