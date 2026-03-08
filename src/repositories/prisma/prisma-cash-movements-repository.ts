import { prisma } from "@/lib/prisma";
import type {
  CashMovementData,
  CashMovementsRepository,
  CreateCashMovementInput,
} from "../cash-movements-repository";

export class PrismaCashMovementsRepository implements CashMovementsRepository {
  async create(data: CreateCashMovementInput): Promise<CashMovementData> {
    const movement = await prisma.cashMovement.create({
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        movement_date: data.movementDate ?? new Date(),
        cash_register_id: data.cashRegisterId,
      },
    });

    return {
      id: movement.id,
      type: movement.type,
      amount: Number(movement.amount),
      description: movement.description,
      movementDate: movement.movement_date,
      cashRegisterId: movement.cash_register_id,
    };
  }

  async listByRegisterBetween(
    cashRegisterId: string,
    from: Date,
    to: Date,
  ): Promise<CashMovementData[]> {
    const movements = await prisma.cashMovement.findMany({
      where: {
        cash_register_id: cashRegisterId,
        movement_date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { movement_date: "asc" },
    });

    return movements.map((movement) => ({
      id: movement.id,
      type: movement.type,
      amount: Number(movement.amount),
      description: movement.description,
      movementDate: movement.movement_date,
      cashRegisterId: movement.cash_register_id,
    }));
  }
}
