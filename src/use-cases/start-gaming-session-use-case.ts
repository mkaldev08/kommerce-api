import { GamingConsoleStatus } from 'generated/prisma/enums'
import type { BusinessUnitRepository } from '@/repositories/business-unit-repository'
import type { GamingConsolesRepository } from '@/repositories/gaming-consoles-repository'
import type { GamingCustomersRepository } from '@/repositories/gaming-customers-repository'
import type { GamingGamesRepository } from '@/repositories/gaming-games-repository'
import type {
  GamingSessionData,
  GamingSessionsRepository,
} from '@/repositories/gaming-sessions-repository'
import { BusinessUnitNotGamingHouseError } from './errors/business-unit-not-gaming-house-error'
import { GamingConsoleNotAvailableError } from './errors/gaming-console-not-available-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface StartGamingSessionUseCaseRequest {
  businessUnitId: string
  customerId: string
  consoleId: string
  gameId: string
  startTime?: Date
  notes?: string | null
}

interface StartGamingSessionUseCaseResponse {
  session: GamingSessionData
}

export class StartGamingSessionUseCase {
  constructor(
    private businessUnitRepository: BusinessUnitRepository,
    private gamingCustomersRepository: GamingCustomersRepository,
    private gamingConsolesRepository: GamingConsolesRepository,
    private gamingGamesRepository: GamingGamesRepository,
    private gamingSessionsRepository: GamingSessionsRepository,
  ) {}

  async execute(
    request: StartGamingSessionUseCaseRequest,
  ): Promise<StartGamingSessionUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      request.businessUnitId,
    )

    if (!businessUnit) {
      throw new ResourceNotFoundError()
    }

    if (businessUnit.type !== 'GAMING_HOUSE') {
      throw new BusinessUnitNotGamingHouseError()
    }

    const [customer, consoleUnit, game] = await Promise.all([
      this.gamingCustomersRepository.findById(request.customerId),
      this.gamingConsolesRepository.findById(request.consoleId),
      this.gamingGamesRepository.findById(request.gameId),
    ])

    if (!customer || customer.businessUnitId !== request.businessUnitId) {
      throw new ResourceNotFoundError()
    }

    if (!consoleUnit || consoleUnit.businessUnitId !== request.businessUnitId) {
      throw new ResourceNotFoundError()
    }

    if (!game || game.businessUnitId !== request.businessUnitId) {
      throw new ResourceNotFoundError()
    }

    if (
      !consoleUnit.isActive ||
      consoleUnit.status !== GamingConsoleStatus.AVAILABLE
    ) {
      throw new GamingConsoleNotAvailableError()
    }

    const activeSession =
      await this.gamingSessionsRepository.findActiveByConsoleId(consoleUnit.id)

    if (activeSession) {
      throw new GamingConsoleNotAvailableError()
    }

    const session = await this.gamingSessionsRepository.start({
      businessUnitId: request.businessUnitId,
      customerId: customer.id,
      consoleId: consoleUnit.id,
      gameId: game.id,
      startTime: request.startTime || new Date(),
      hourlyRate: game.hourlyRate,
      notes: request.notes || null,
    })

    await this.gamingConsolesRepository.updateStatus(
      consoleUnit.id,
      GamingConsoleStatus.IN_USE,
    )

    return { session }
  }
}
