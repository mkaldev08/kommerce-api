import type { CashRegisterStatus } from '@/modules/store/domain/enums'

export interface CashRegisterData {
  id: string
  status: CashRegisterStatus
  openedAt?: Date | null
  closedAt?: Date | null
  businessUnitId: string
  operatorId: string
}

export interface CreateCashRegisterInput {
  businessUnitId: string
  operatorId: string
  status: CashRegisterStatus
  openedAt?: Date | null
  closedAt?: Date | null
}

export interface CashRegistersRepository {
  create(data: CreateCashRegisterInput): Promise<CashRegisterData>
  findById(id: string): Promise<CashRegisterData | null>
  findOpenByBusinessUnitId(
    businessUnitId: string,
  ): Promise<CashRegisterData | null>
  updateStatus(
    id: string,
    status: CashRegisterStatus,
    openedAt?: Date | null,
    closedAt?: Date | null,
  ): Promise<void>
}
