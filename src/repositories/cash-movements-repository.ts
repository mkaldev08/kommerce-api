import type { CashMovementType } from "generated/prisma/enums";

export interface CashMovementData {
  id: string;
  type: CashMovementType;
  amount: number;
  description?: string | null;
  movementDate: Date;
  cashRegisterId: string;
}

export interface CreateCashMovementInput {
  type: CashMovementType;
  amount: number;
  description?: string | null;
  movementDate?: Date;
  cashRegisterId: string;
}

export interface CashMovementsRepository {
  create(data: CreateCashMovementInput): Promise<CashMovementData>;
  listByRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<CashMovementData[]>;
}
