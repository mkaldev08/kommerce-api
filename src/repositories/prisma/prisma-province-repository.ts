import type { Province } from 'generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { ProvinceRepository } from '../province-repository'

export class PrismaProvinceRepository implements ProvinceRepository {
  async findById(provinceId: string): Promise<Province | null> {
    const province = await prisma.province.findUnique({
      where: { id: provinceId },
    })
    return province
  }

  async findAll(): Promise<Province[]> {
    const provinces = await prisma.province.findMany()
    return provinces
  }
}
