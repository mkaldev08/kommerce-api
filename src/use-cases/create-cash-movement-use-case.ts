import type { CashMovementType } from '@/modules/store/domain/enums'
import { CashRegisterClosedError } from '../errors/cash-register-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import type { CashMovementsRepository } from '../ports/repositories/cash-movements-repository'
import type { CashRegistersRepository } from '../ports/repositories/cash-registers-repository'
import { err, ok, type Result } from '../result'

interface CreateCashMovementRequest {
  cashRegisterId: string
  type: CashMovementType
  amount: number
  description?: string | null
}

interface CreateCashMovementResponse {
  movementId: string
}

export class CreateCashMovementUseCase {
  constructor(
    private cashRegistersRepository: CashRegistersRepository,
    private cashMovementsRepository: CashMovementsRepository,
  ) {}

  async execute(
    request: CreateCashMovementRequest,
  ): Promise<Result<CreateCashMovementResponse, Error>> {
    const cashRegister = await this.cashRegistersRepository.findById(
      request.cashRegisterId,
    )

    if (!cashRegister) {
      return err(new ResourceNotFoundError())
    }

    if (cashRegister.status !== 'OPEN') {
      return err(new CashRegisterClosedError())
    }

    const movement = await this.cashMovementsRepository.create({
      cashRegisterId: request.cashRegisterId,
      type: request.type,
      amount: request.amount,
      description: request.description ?? null,
      movementDate: new Date(),
    })

    return ok({ movementId: movement.id })
  }
}
