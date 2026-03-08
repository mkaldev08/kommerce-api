import {
  CashRegisterStatus,
  type CashMovementType,
} from "generated/prisma/enums";
import type { CashMovementsRepository } from "@/repositories/cash-movements-repository";
import type { CashRegistersRepository } from "@/repositories/cash-registers-repository";
import { CashRegisterClosedError } from "./errors/cash-register-closed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateCashMovementRequest {
  cashRegisterId: string;
  type: CashMovementType;
  amount: number;
  description?: string | null;
}

interface CreateCashMovementResponse {
  movementId: string;
}

export class CreateCashMovementUseCase {
  constructor(
    private cashRegistersRepository: CashRegistersRepository,
    private cashMovementsRepository: CashMovementsRepository,
  ) {}

  async execute(
    request: CreateCashMovementRequest,
  ): Promise<CreateCashMovementResponse> {
    const cashRegister = await this.cashRegistersRepository.findById(
      request.cashRegisterId,
    );

    if (!cashRegister) {
      throw new ResourceNotFoundError();
    }

    if (cashRegister.status !== CashRegisterStatus.OPEN) {
      throw new CashRegisterClosedError();
    }

    const movement = await this.cashMovementsRepository.create({
      cashRegisterId: request.cashRegisterId,
      type: request.type,
      amount: request.amount,
      description: request.description ?? null,
      movementDate: new Date(),
    });

    return { movementId: movement.id };
  }
}
