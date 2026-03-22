import { CashRegisterStatus, WorkShiftStatus } from "generated/prisma/enums";
import type { CashRegistersRepository } from "@/repositories/cash-registers-repository";
import type { WorkShiftsRepository } from "@/repositories/work-shifts-repository";
import { CashRegisterClosedError } from "./errors/cash-register-closed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { WorkShiftAlreadyOpenError } from "./errors/work-shift-already-open-error";

interface OpenWorkShiftRequest {
  cashRegisterId: string;
  operatorId: string;
  openingBalance: number;
}

interface OpenWorkShiftResponse {
  workShiftId: string;
}

export class OpenWorkShiftUseCase {
  constructor(
    private cashRegistersRepository: CashRegistersRepository,
    private workShiftsRepository: WorkShiftsRepository,
  ) {}

  async execute(request: OpenWorkShiftRequest): Promise<OpenWorkShiftResponse> {
    const cashRegister = await this.cashRegistersRepository.findById(
      request.cashRegisterId,
    );

    if (!cashRegister) {
      throw new ResourceNotFoundError();
    }

    if (cashRegister.status !== CashRegisterStatus.OPEN) {
      throw new CashRegisterClosedError();
    }

    const existingShift =
      await this.workShiftsRepository.findOpenByCashRegisterId(
        request.cashRegisterId,
      );

    if (existingShift) {
      throw new WorkShiftAlreadyOpenError();
    }

    const workShift = await this.workShiftsRepository.create({
      cashRegisterId: request.cashRegisterId,
      operatorId: request.operatorId,
      openingBalance: request.openingBalance,
      startTime: new Date(),
      status: WorkShiftStatus.OPEN,
    });

    return { workShiftId: workShift.id };
  }
}
