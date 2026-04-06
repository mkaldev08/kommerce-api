import type { GamingGame } from 'generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type {
  CreateGamingGameInput,
  GamingGameData,
  GamingGamesRepository,
} from '../gaming-games-repository'

export class PrismaGamingGamesRepository implements GamingGamesRepository {
  async create(data: CreateGamingGameInput): Promise<GamingGameData> {
    const game = await prisma.gamingGame.create({
      data: {
        business_unit_id: data.businessUnitId,
        name: data.name,
        genre: data.genre || null,
        hourly_rate: data.hourlyRate,
        is_active: data.isActive ?? true,
      },
    })

    return this.toGamingGameData(game)
  }

  async findById(id: string): Promise<GamingGameData | null> {
    const game = await prisma.gamingGame.findUnique({
      where: { id },
    })

    return game ? this.toGamingGameData(game) : null
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<GamingGameData[]> {
    const games = await prisma.gamingGame.findMany({
      where: { business_unit_id: businessUnitId },
      orderBy: { name: 'asc' },
    })

    return games.map((game) => this.toGamingGameData(game))
  }

  async update(
    id: string,
    data: Partial<Omit<CreateGamingGameInput, 'businessUnitId'>>,
  ): Promise<GamingGameData> {
    const game = await prisma.gamingGame.update({
      where: { id },
      data: {
        name: data.name,
        genre: data.genre !== undefined ? data.genre : undefined,
        hourly_rate: data.hourlyRate,
        is_active: data.isActive !== undefined ? data.isActive : undefined,
      },
    })

    return this.toGamingGameData(game)
  }

  async delete(id: string): Promise<void> {
    await prisma.gamingGame.delete({ where: { id } })
  }

  private toGamingGameData(game: GamingGame): GamingGameData {
    return {
      id: game.id,
      businessUnitId: game.business_unit_id,
      name: game.name,
      genre: game.genre,
      hourlyRate: Number(game.hourly_rate),
      isActive: game.is_active,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
    }
  }
}
