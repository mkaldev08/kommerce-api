import { CashRegisterStatus } from "generated/prisma/enums";
import type { CashRegistersRepository } from "@/repositories/cash-registers-repository";
import type { WorkShiftsRepository } from "@/repositories/work-shifts-repository";
import { CashRegisterClosedError } from "./errors/cash-register-closed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { WorkShiftStillOpenError } from "./errors/work-shift-still-open-error";

interface CloseCashRegisterRequest {
  cashRegisterId: string;
}

interface CloseCashRegisterResponse {
  cashRegisterId: string;
}

export class CloseCashRegisterUseCase {
  constructor(
    private cashRegistersRepository: CashRegistersRepository,
    private workShiftsRepository: WorkShiftsRepository,
  ) {}

  async execute(
    request: CloseCashRegisterRequest,
  ): Promise<CloseCashRegisterResponse> {
    const cashRegister = await this.cashRegistersRepository.findById(
      request.cashRegisterId,
    );

    if (!cashRegister) {
      throw new ResourceNotFoundError();
    }

    if (cashRegister.status !== CashRegisterStatus.OPEN) {
      throw new CashRegisterClosedError();
    }

    const openShift = await this.workShiftsRepository.findOpenByCashRegisterId(
      request.cashRegisterId,
    );

    if (openShift) {
      throw new WorkShiftStillOpenError();
    }

    await this.cashRegistersRepository.updateStatus(
      request.cashRegisterId,
      CashRegisterStatus.CLOSED,
      cashRegister.openedAt ?? null,
      new Date(),
    );

    return { cashRegisterId: request.cashRegisterId };
  }
}
