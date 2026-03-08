import { WorkShiftStatus } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
  CreateWorkShiftInput,
  WorkShiftData,
  WorkShiftsRepository,
} from "../work-shifts-repository";

export class PrismaWorkShiftsRepository implements WorkShiftsRepository {
  async create(data: CreateWorkShiftInput): Promise<WorkShiftData> {
    const workShift = await prisma.workShift.create({
      data: {
        start_time: data.startTime ?? new Date(),
        opening_balance: data.openingBalance,
        status: data.status,
        operator_id: data.operatorId,
        cash_register_id: data.cashRegisterId,
      },
    });

    return {
      id: workShift.id,
      startTime: workShift.start_time,
      endTime: workShift.end_time,
      openingBalance: Number(workShift.opening_balance),
      closingBalance: workShift.closing_balance
        ? Number(workShift.closing_balance)
        : null,
      status: workShift.status,
      operatorId: workShift.operator_id,
      cashRegisterId: workShift.cash_register_id,
    };
  }

  async findById(id: string): Promise<WorkShiftData | null> {
    const workShift = await prisma.workShift.findUnique({ where: { id } });

    if (!workShift) {
      return null;
    }

    return {
      id: workShift.id,
      startTime: workShift.start_time,
      endTime: workShift.end_time,
      openingBalance: Number(workShift.opening_balance),
      closingBalance: workShift.closing_balance
        ? Number(workShift.closing_balance)
        : null,
      status: workShift.status,
      operatorId: workShift.operator_id,
      cashRegisterId: workShift.cash_register_id,
    };
  }

  async findOpenByCashRegisterAndOperator(
    cashRegisterId: string,
    operatorId: string,
  ): Promise<WorkShiftData | null> {
    const workShift = await prisma.workShift.findFirst({
      where: {
        cash_register_id: cashRegisterId,
        operator_id: operatorId,
        status: WorkShiftStatus.OPEN,
      },
      orderBy: { start_time: "desc" },
    });

    if (!workShift) {
      return null;
    }

    return {
      id: workShift.id,
      startTime: workShift.start_time,
      endTime: workShift.end_time,
      openingBalance: Number(workShift.opening_balance),
      closingBalance: workShift.closing_balance
        ? Number(workShift.closing_balance)
        : null,
      status: workShift.status,
      operatorId: workShift.operator_id,
      cashRegisterId: workShift.cash_register_id,
    };
  }

  async findOpenByCashRegisterId(
    cashRegisterId: string,
  ): Promise<WorkShiftData | null> {
    const workShift = await prisma.workShift.findFirst({
      where: {
        cash_register_id: cashRegisterId,
        status: WorkShiftStatus.OPEN,
      },
      orderBy: { start_time: "desc" },
    });

    if (!workShift) {
      return null;
    }

    return {
      id: workShift.id,
      startTime: workShift.start_time,
      endTime: workShift.end_time,
      openingBalance: Number(workShift.opening_balance),
      closingBalance: workShift.closing_balance
        ? Number(workShift.closing_balance)
        : null,
      status: workShift.status,
      operatorId: workShift.operator_id,
      cashRegisterId: workShift.cash_register_id,
    };
  }

  async close(
    id: string,
    closingBalance: number,
    endTime?: Date,
  ): Promise<void> {
    await prisma.workShift.update({
      where: { id },
      data: {
        closing_balance: closingBalance,
        end_time: endTime ?? new Date(),
        status: WorkShiftStatus.CLOSED,
      },
    });
  }
}
