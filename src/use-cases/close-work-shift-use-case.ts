import { CashBalanceMismatchError } from '../errors/cash-balance-mismatch-error'
import { CashRegisterClosedError } from '../errors/cash-register-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { WorkShiftNotOpenError } from '../errors/work-shift-not-open-error'
import type { CashRegistersRepository } from '../ports/repositories/cash-registers-repository'
import type { WorkShiftsRepository } from '../ports/repositories/work-shifts-repository'
import { err, ok, type Result } from '../result'
import type { CalculateCashBalanceUseCase } from './calculate-cash-balance-use-case'

interface CloseWorkShiftRequest {
  workShiftId: string
  closingBalance: number
}

interface CloseWorkShiftResponse {
  expectedBalance: number
}

export class CloseWorkShiftUseCase {
  constructor(
    private cashRegistersRepository: CashRegistersRepository,
    private workShiftsRepository: WorkShiftsRepository,
    private calculateCashBalanceUseCase: CalculateCashBalanceUseCase,
  ) {}

  async execute(
    request: CloseWorkShiftRequest,
  ): Promise<Result<CloseWorkShiftResponse, Error>> {
    const workShift = await this.workShiftsRepository.findById(
      request.workShiftId,
    )

    if (!workShift) {
      return err(new ResourceNotFoundError())
    }

    if (workShift.status !== 'OPEN') {
      return err(new WorkShiftNotOpenError())
    }

    const cashRegister = await this.cashRegistersRepository.findById(
      workShift.cashRegisterId,
    )

    if (!cashRegister) {
      return err(new ResourceNotFoundError())
    }

    if (cashRegister.status !== 'OPEN') {
      return err(new CashRegisterClosedError())
    }

    const endTime = new Date()
    const { expectedBalance } = await this.calculateCashBalanceUseCase.execute({
      cashRegisterId: workShift.cashRegisterId,
      openingBalance: workShift.openingBalance,
      startTime: workShift.startTime,
      endTime,
    })

    if (Math.abs(expectedBalance - request.closingBalance) > 0.01) {
      return err(new CashBalanceMismatchError())
    }

    await this.workShiftsRepository.close(
      workShift.id,
      request.closingBalance,
      endTime,
    )

    return ok({ expectedBalance })
  }
}
