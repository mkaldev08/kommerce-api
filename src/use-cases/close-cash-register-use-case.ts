import { CashRegisterClosedError } from '../errors/cash-register-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { WorkShiftStillOpenError } from '../errors/work-shift-still-open-error'
import type { CashRegistersRepository } from '../ports/repositories/cash-registers-repository'
import type { WorkShiftsRepository } from '../ports/repositories/work-shifts-repository'
import { err, ok, type Result } from '../result'

interface CloseCashRegisterRequest {
  cashRegisterId: string
}

interface CloseCashRegisterResponse {
  cashRegisterId: string
}

export class CloseCashRegisterUseCase {
  constructor(
    private cashRegistersRepository: CashRegistersRepository,
    private workShiftsRepository: WorkShiftsRepository,
  ) {}

  async execute(
    request: CloseCashRegisterRequest,
  ): Promise<Result<CloseCashRegisterResponse, Error>> {
    const cashRegister = await this.cashRegistersRepository.findById(
      request.cashRegisterId,
    )

    if (!cashRegister) {
      return err(new ResourceNotFoundError())
    }

    if (cashRegister.status !== 'OPEN') {
      return err(new CashRegisterClosedError())
    }

    const openShift = await this.workShiftsRepository.findOpenByCashRegisterId(
      request.cashRegisterId,
    )

    if (openShift) {
      return err(new WorkShiftStillOpenError())
    }

    await this.cashRegistersRepository.updateStatus(
      request.cashRegisterId,
      'CLOSED',
      cashRegister.openedAt ?? null,
      new Date(),
    )

    return ok({ cashRegisterId: request.cashRegisterId })
  }
}
