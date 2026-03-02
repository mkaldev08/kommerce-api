import type { WorkShiftStatus } from '@/modules/store/domain/enums'
import { CashRegisterClosedError } from '../errors/cash-register-closed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { WorkShiftAlreadyOpenError } from '../errors/work-shift-already-open-error'
import type { CashRegistersRepository } from '../ports/repositories/cash-registers-repository'
import type { WorkShiftsRepository } from '../ports/repositories/work-shifts-repository'
import { err, ok, type Result } from '../result'

interface OpenWorkShiftRequest {
  cashRegisterId: string
  operatorId: string
  openingBalance: number
}

interface OpenWorkShiftResponse {
  workShiftId: string
}

export class OpenWorkShiftUseCase {
  constructor(
    private cashRegistersRepository: CashRegistersRepository,
    private workShiftsRepository: WorkShiftsRepository,
  ) {}

  async execute(
    request: OpenWorkShiftRequest,
  ): Promise<Result<OpenWorkShiftResponse, Error>> {
    const cashRegister = await this.cashRegistersRepository.findById(
      request.cashRegisterId,
    )

    if (!cashRegister) {
      return err(new ResourceNotFoundError())
    }

    if (cashRegister.status !== 'OPEN') {
      return err(new CashRegisterClosedError())
    }

    const existingShift =
      await this.workShiftsRepository.findOpenByCashRegisterAndOperator(
        request.cashRegisterId,
        request.operatorId,
      )

    if (existingShift) {
      return err(new WorkShiftAlreadyOpenError())
    }

    const workShift = await this.workShiftsRepository.create({
      cashRegisterId: request.cashRegisterId,
      operatorId: request.operatorId,
      openingBalance: request.openingBalance,
      startTime: new Date(),
      status: 'OPEN' as WorkShiftStatus,
    })

    return ok({ workShiftId: workShift.id })
  }
}
