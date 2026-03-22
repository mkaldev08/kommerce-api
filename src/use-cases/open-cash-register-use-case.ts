import { CashRegisterStatus } from "generated/prisma/enums";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type { CashRegistersRepository } from "@/repositories/cash-registers-repository";
import { CashRegisterAlreadyOpenError } from "./errors/cash-register-already-open-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface OpenCashRegisterRequest {
  businessUnitId: string;
  operatorId: string;
}

interface OpenCashRegisterResponse {
  cashRegisterId: string;
}

export class OpenCashRegisterUseCase {
  constructor(
    private businessUnitRepository: BusinessUnitRepository,
    private cashRegistersRepository: CashRegistersRepository,
  ) {}

  async execute(
    request: OpenCashRegisterRequest,
  ): Promise<OpenCashRegisterResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      request.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    const existingOpen =
      await this.cashRegistersRepository.findOpenByBusinessUnitId(
        request.businessUnitId,
      );

    if (existingOpen) {
      throw new CashRegisterAlreadyOpenError();
    }

    const cashRegister = await this.cashRegistersRepository.create({
      businessUnitId: request.businessUnitId,
      operatorId: request.operatorId,
      status: CashRegisterStatus.OPEN,
      openedAt: new Date(),
      closedAt: null,
    });

    return { cashRegisterId: cashRegister.id };
  }
}
