import type { CashRegisterStatus } from '@/modules/store/domain/enums'
import { BusinessUnitNotStoreError } from '../errors/business-unit-not-store-error'
import { CashRegisterAlreadyOpenError } from '../errors/cash-register-already-open-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import type { BusinessUnitsRepository } from '../ports/repositories/business-units-repository'
import type { CashRegistersRepository } from '../ports/repositories/cash-registers-repository'
import { err, ok, type Result } from '../result'

interface OpenCashRegisterRequest {
  businessUnitId: string
  operatorId: string
}

interface OpenCashRegisterResponse {
  cashRegisterId: string
}

export class OpenCashRegisterUseCase {
  constructor(
    private businessUnitsRepository: BusinessUnitsRepository,
    private cashRegistersRepository: CashRegistersRepository,
  ) {}

  async execute(
    request: OpenCashRegisterRequest,
  ): Promise<Result<OpenCashRegisterResponse, Error>> {
    const businessUnit = await this.businessUnitsRepository.findById(
      request.businessUnitId,
    )

    if (!businessUnit) {
      return err(new ResourceNotFoundError())
    }

    if (businessUnit.type !== 'STORE') {
      return err(new BusinessUnitNotStoreError())
    }

    const existingOpen =
      await this.cashRegistersRepository.findOpenByBusinessUnitId(
        request.businessUnitId,
      )

    if (existingOpen) {
      return err(new CashRegisterAlreadyOpenError())
    }

    const cashRegister = await this.cashRegistersRepository.create({
      businessUnitId: request.businessUnitId,
      operatorId: request.operatorId,
      status: 'OPEN' as CashRegisterStatus,
      openedAt: new Date(),
      closedAt: null,
    })

    return ok({ cashRegisterId: cashRegister.id })
  }
}
