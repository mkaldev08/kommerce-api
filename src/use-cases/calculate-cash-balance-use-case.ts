import { CashMovementType } from "generated/prisma/enums";
import type { CashMovementsRepository } from "@/repositories/cash-movements-repository";

interface CalculateCashBalanceRequest {
  cashRegisterId: string;
  openingBalance: number;
  startTime: Date;
  endTime: Date;
}

interface CalculateCashBalanceResponse {
  expectedBalance: number;
}

export class CalculateCashBalanceUseCase {
  constructor(private cashMovementsRepository: CashMovementsRepository) {}

  async execute(
    params: CalculateCashBalanceRequest,
  ): Promise<CalculateCashBalanceResponse> {
    const movements = await this.cashMovementsRepository.listByRegisterBetween(
      params.cashRegisterId,
      params.startTime,
      params.endTime,
    );

    const movementsTotal = movements.reduce((total, movement) => {
      return movement.type === CashMovementType.ENTRY
        ? total + movement.amount
        : total - movement.amount;
    }, 0);

    const expectedBalance = params.openingBalance + movementsTotal;

    return { expectedBalance };
  }
}
