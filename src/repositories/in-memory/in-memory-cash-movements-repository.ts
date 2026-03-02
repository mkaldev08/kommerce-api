import { uuidv7 } from 'uuidv7'
import type {
  CashMovementData,
  CashMovementsRepository,
  CreateCashMovementInput,
} from '@/modules/store/application/ports/repositories/cash-movements-repository'

export class InMemoryCashMovementsRepository
  implements CashMovementsRepository
{
  items: CashMovementData[] = []

  async create(data: CreateCashMovementInput): Promise<CashMovementData> {
    const movement: CashMovementData = {
      id: uuidv7(),
      type: data.type,
      amount: data.amount,
      description: data.description ?? null,
      movementDate: data.movementDate ?? new Date(),
      cashRegisterId: data.cashRegisterId,
    }

    this.items.push(movement)

    return movement
  }

  async listByRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<CashMovementData[]> {
    return this.items.filter(
      (item) =>
        item.cashRegisterId === cashRegisterId &&
        item.movementDate >= from &&
        item.movementDate <= to,
    )
  }
}
