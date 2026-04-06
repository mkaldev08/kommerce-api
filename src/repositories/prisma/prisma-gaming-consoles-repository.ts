import type { GamingConsole } from 'generated/prisma/client'
import { GamingConsoleStatus } from 'generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import type {
  CreateGamingConsoleInput,
  GamingConsoleData,
  GamingConsolesRepository,
} from '../gaming-consoles-repository'

export class PrismaGamingConsolesRepository
  implements GamingConsolesRepository
{
  async create(data: CreateGamingConsoleInput): Promise<GamingConsoleData> {
    const consoleUnit = await prisma.gamingConsole.create({
      data: {
        business_unit_id: data.businessUnitId,
        name: data.name,
        brand: data.brand || null,
        model: data.model || null,
        hourly_rate: data.hourlyRate ?? 1,
        status: data.status || GamingConsoleStatus.AVAILABLE,
        is_active: data.isActive ?? true,
      },
    })

    return this.toGamingConsoleData(consoleUnit)
  }

  async findById(id: string): Promise<GamingConsoleData | null> {
    const consoleUnit = await prisma.gamingConsole.findUnique({
      where: { id },
    })

    return consoleUnit ? this.toGamingConsoleData(consoleUnit) : null
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<GamingConsoleData[]> {
    const consoleUnits = await prisma.gamingConsole.findMany({
      where: { business_unit_id: businessUnitId },
      orderBy: { name: 'asc' },
    })

    return consoleUnits.map((consoleUnit) =>
      this.toGamingConsoleData(consoleUnit),
    )
  }

  async update(
    id: string,
    data: Partial<Omit<CreateGamingConsoleInput, 'businessUnitId'>>,
  ): Promise<GamingConsoleData> {
    const consoleUnit = await prisma.gamingConsole.update({
      where: { id },
      data: {
        name: data.name,
        brand: data.brand !== undefined ? data.brand : undefined,
        model: data.model !== undefined ? data.model : undefined,
        hourly_rate:
          data.hourlyRate !== undefined ? data.hourlyRate : undefined,
        status: data.status !== undefined ? data.status : undefined,
        is_active: data.isActive !== undefined ? data.isActive : undefined,
      },
    })

    return this.toGamingConsoleData(consoleUnit)
  }

  async updateStatus(
    id: string,
    status: GamingConsoleStatus,
  ): Promise<GamingConsoleData> {
    const consoleUnit = await prisma.gamingConsole.update({
      where: { id },
      data: { status },
    })

    return this.toGamingConsoleData(consoleUnit)
  }

  async delete(id: string): Promise<void> {
    await prisma.gamingConsole.update({
      data: { deleted_at: new Date() },
      where: { id },
    })
  }

  private toGamingConsoleData(consoleUnit: GamingConsole): GamingConsoleData {
    return {
      id: consoleUnit.id,
      businessUnitId: consoleUnit.business_unit_id,
      name: consoleUnit.name,
      brand: consoleUnit.brand,
      model: consoleUnit.model,
      hourlyRate: Number(consoleUnit.hourly_rate),
      status: consoleUnit.status,
      isActive: consoleUnit.is_active,
      createdAt: consoleUnit.created_at,
      updatedAt: consoleUnit.updated_at,
    }
  }
}
