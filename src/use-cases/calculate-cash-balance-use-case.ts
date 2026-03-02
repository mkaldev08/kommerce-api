import { Money } from '@/modules/store/domain/value-objects/money'
import type { CashMovementsRepository } from '../ports/repositories/cash-movements-repository'
import type { PaymentsRepository } from '../ports/repositories/payments-repository'

interface CalculateCashBalanceRequest {
  cashRegisterId: string
  openingBalance: number
  startTime: Date
  endTime: Date
}

interface CalculateCashBalanceResponse {
  expectedBalance: number
}

export class CalculateCashBalanceUseCase {
  constructor(
    private cashMovementsRepository: CashMovementsRepository,
    private paymentsRepository: PaymentsRepository,
  ) {}

  async execute(
    params: CalculateCashBalanceRequest,
  ): Promise<CalculateCashBalanceResponse> {
    const [movements, cashPaymentsTotal] = await Promise.all([
      this.cashMovementsRepository.listByRegisterBetween(
        params.cashRegisterId,
        params.startTime,
        params.endTime,
      ),
      this.paymentsRepository.getCashTotalForRegisterBetween(
        params.cashRegisterId,
        params.startTime,
        params.endTime,
      ),
    ])

    const opening = Money.fromDecimal(params.openingBalance)
    const movementsTotal = movements.reduce((total, movement) => {
      const amount = Money.fromDecimal(movement.amount)
      return movement.type === 'ENTRY'
        ? total.add(amount)
        : total.subtract(amount)
    }, Money.zero())

    const expectedBalance = opening
      .add(movementsTotal)
      .add(Money.fromDecimal(cashPaymentsTotal))
      .toDecimal()

    return { expectedBalance }
  }
}
