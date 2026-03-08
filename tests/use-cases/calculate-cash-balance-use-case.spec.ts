import { describe, expect, it } from "vitest";
import { CashMovementType } from "generated/prisma/enums";
import type {
  CashMovementData,
  CashMovementsRepository,
  CreateCashMovementInput,
} from "@/repositories/cash-movements-repository";
import { CalculateCashBalanceUseCase } from "@/use-cases/calculate-cash-balance-use-case";

class InMemoryCashMovementsRepository implements CashMovementsRepository {
  constructor(private readonly movements: CashMovementData[]) {}

  async create(data: CreateCashMovementInput): Promise<CashMovementData> {
    return {
      id: crypto.randomUUID(),
      type: data.type,
      amount: data.amount,
      description: data.description,
      movementDate: data.movementDate ?? new Date(),
      cashRegisterId: data.cashRegisterId,
    };
  }

  async listByRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<CashMovementData[]> {
    return this.movements.filter(
      (movement) =>
        movement.cashRegisterId === cashRegisterId &&
        movement.movementDate >= from &&
        movement.movementDate <= to,
    );
  }
}

describe("CalculateCashBalanceUseCase", () => {
  it("should calculate expected balance from opening balance and movements", async () => {
    const cashRegisterId = crypto.randomUUID();
    const movementsRepository = new InMemoryCashMovementsRepository([
      {
        id: crypto.randomUUID(),
        cashRegisterId,
        type: CashMovementType.ENTRY,
        amount: 100,
        description: null,
        movementDate: new Date("2026-03-06T09:00:00.000Z"),
      },
      {
        id: crypto.randomUUID(),
        cashRegisterId,
        type: CashMovementType.EXIT,
        amount: 30,
        description: null,
        movementDate: new Date("2026-03-06T10:00:00.000Z"),
      },
      {
        id: crypto.randomUUID(),
        cashRegisterId,
        type: CashMovementType.ENTRY,
        amount: 50,
        description: null,
        movementDate: new Date("2026-03-06T11:00:00.000Z"),
      },
    ]);

    const sut = new CalculateCashBalanceUseCase(movementsRepository);

    const result = await sut.execute({
      cashRegisterId,
      openingBalance: 500,
      startTime: new Date("2026-03-06T08:00:00.000Z"),
      endTime: new Date("2026-03-06T12:00:00.000Z"),
    });

    expect(result.expectedBalance).toBe(620);
  });

  it("should return opening balance when there are no movements", async () => {
    const cashRegisterId = crypto.randomUUID();
    const movementsRepository = new InMemoryCashMovementsRepository([]);

    const sut = new CalculateCashBalanceUseCase(movementsRepository);

    const result = await sut.execute({
      cashRegisterId,
      openingBalance: 250,
      startTime: new Date("2026-03-06T08:00:00.000Z"),
      endTime: new Date("2026-03-06T12:00:00.000Z"),
    });

    expect(result.expectedBalance).toBe(250);
  });
});
