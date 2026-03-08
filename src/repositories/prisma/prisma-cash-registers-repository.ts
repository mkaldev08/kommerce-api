import { CashRegisterStatus } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
  CashRegisterData,
  CashRegistersRepository,
  CreateCashRegisterInput,
} from "../cash-registers-repository";

export class PrismaCashRegistersRepository implements CashRegistersRepository {
  async create(data: CreateCashRegisterInput): Promise<CashRegisterData> {
    const cashRegister = await prisma.cashRegister.create({
      data: {
        status: data.status,
        opened_at: data.openedAt ?? null,
        closed_at: data.closedAt ?? null,
        business_unit_id: data.businessUnitId,
        operator_id: data.operatorId,
      },
    });

    return {
      id: cashRegister.id,
      status: cashRegister.status,
      openedAt: cashRegister.opened_at,
      closedAt: cashRegister.closed_at,
      businessUnitId: cashRegister.business_unit_id,
      operatorId: cashRegister.operator_id,
    };
  }

  async findById(id: string): Promise<CashRegisterData | null> {
    const cashRegister = await prisma.cashRegister.findUnique({
      where: { id },
    });

    if (!cashRegister) {
      return null;
    }

    return {
      id: cashRegister.id,
      status: cashRegister.status,
      openedAt: cashRegister.opened_at,
      closedAt: cashRegister.closed_at,
      businessUnitId: cashRegister.business_unit_id,
      operatorId: cashRegister.operator_id,
    };
  }

  async findOpenByBusinessUnitId(
    businessUnitId: string,
  ): Promise<CashRegisterData | null> {
    const cashRegister = await prisma.cashRegister.findFirst({
      where: {
        business_unit_id: businessUnitId,
        status: CashRegisterStatus.OPEN,
      },
      orderBy: { opened_at: "desc" },
    });

    if (!cashRegister) {
      return null;
    }

    return {
      id: cashRegister.id,
      status: cashRegister.status,
      openedAt: cashRegister.opened_at,
      closedAt: cashRegister.closed_at,
      businessUnitId: cashRegister.business_unit_id,
      operatorId: cashRegister.operator_id,
    };
  }

  async updateStatus(
    id: string,
    status: CashRegisterStatus,
    openedAt?: Date | null,
    closedAt?: Date | null,
  ): Promise<void> {
    await prisma.cashRegister.update({
      where: { id },
      data: {
        status,
        opened_at: openedAt,
        closed_at: closedAt,
      },
    });
  }
}
