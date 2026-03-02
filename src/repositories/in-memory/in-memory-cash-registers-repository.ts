import { uuidv7 } from 'uuidv7'
import type {
  CashRegisterData,
  CashRegistersRepository,
  CreateCashRegisterInput,
} from '@/modules/store/application/ports/repositories/cash-registers-repository'

export class InMemoryCashRegistersRepository
  implements CashRegistersRepository
{
  items: CashRegisterData[] = []

  async create(data: CreateCashRegisterInput): Promise<CashRegisterData> {
    const cashRegister: CashRegisterData = {
      id: uuidv7(),
      status: data.status,
      openedAt: data.openedAt ?? null,
      closedAt: data.closedAt ?? null,
      businessUnitId: data.businessUnitId,
      operatorId: data.operatorId,
    }

    this.items.push(cashRegister)

    return cashRegister
  }

  async findById(id: string): Promise<CashRegisterData | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findOpenByBusinessUnitId(
    businessUnitId: string,
  ): Promise<CashRegisterData | null> {
    return (
      this.items.find(
        (item) =>
          item.businessUnitId === businessUnitId && item.status === 'OPEN',
      ) ?? null
    )
  }

  async updateStatus(
    id: string,
    status: 'OPEN' | 'CLOSED' | 'SUSPENDED',
    openedAt?: Date | null,
    closedAt?: Date | null,
  ): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)

    if (index === -1) {
      throw new Error('Cash register not found')
    }

    this.items[index] = {
      ...this.items[index],
      status,
      openedAt: openedAt ?? null,
      closedAt: closedAt ?? null,
    }
  }
}
