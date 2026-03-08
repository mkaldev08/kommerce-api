import { beforeEach, describe, expect, it } from "vitest";
import { CashRegisterStatus, WorkShiftStatus } from "generated/prisma/enums";
import type {
  CashRegisterData,
  CashRegistersRepository,
  CreateCashRegisterInput,
} from "@/repositories/cash-registers-repository";
import type {
  CreateWorkShiftInput,
  WorkShiftData,
  WorkShiftsRepository,
} from "@/repositories/work-shifts-repository";
import { CloseWorkShiftUseCase } from "@/use-cases/close-work-shift-use-case";
import { CashBalanceMismatchError } from "@/use-cases/errors/cash-balance-mismatch-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { WorkShiftNotOpenError } from "@/use-cases/errors/work-shift-not-open-error";

class InMemoryCashRegistersRepository implements CashRegistersRepository {
  public items: CashRegisterData[] = [];

  async create(data: CreateCashRegisterInput): Promise<CashRegisterData> {
    const register: CashRegisterData = {
      id: crypto.randomUUID(),
      businessUnitId: data.businessUnitId,
      operatorId: data.operatorId,
      status: data.status,
      openedAt: data.openedAt ?? null,
      closedAt: data.closedAt ?? null,
    };

    this.items.push(register);

    return register;
  }

  async findById(id: string): Promise<CashRegisterData | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findOpenByBusinessUnitId(): Promise<CashRegisterData | null> {
    return null;
  }

  async updateStatus(): Promise<void> {
    return;
  }
}

class InMemoryWorkShiftsRepository implements WorkShiftsRepository {
  public items: WorkShiftData[] = [];
  public closed: Array<{ id: string; closingBalance: number }> = [];

  async create(data: CreateWorkShiftInput): Promise<WorkShiftData> {
    const workShift: WorkShiftData = {
      id: crypto.randomUUID(),
      startTime: data.startTime ?? new Date(),
      openingBalance: data.openingBalance,
      status: data.status,
      operatorId: data.operatorId,
      cashRegisterId: data.cashRegisterId,
      endTime: null,
      closingBalance: null,
    };

    this.items.push(workShift);

    return workShift;
  }

  async findById(id: string): Promise<WorkShiftData | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findOpenByCashRegisterAndOperator(): Promise<WorkShiftData | null> {
    return null;
  }

  async findOpenByCashRegisterId(): Promise<WorkShiftData | null> {
    return null;
  }

  async close(
    id: string,
    closingBalance: number,
    endTime?: Date,
  ): Promise<void> {
    this.closed.push({ id, closingBalance });

    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = {
        ...this.items[index],
        status: WorkShiftStatus.CLOSED,
        closingBalance,
        endTime: endTime ?? new Date(),
      };
    }
  }
}

describe("CloseWorkShiftUseCase", () => {
  let cashRegistersRepository: InMemoryCashRegistersRepository;
  let workShiftsRepository: InMemoryWorkShiftsRepository;

  beforeEach(() => {
    cashRegistersRepository = new InMemoryCashRegistersRepository();
    workShiftsRepository = new InMemoryWorkShiftsRepository();
  });

  it("should close work shift when expected balance matches", async () => {
    const register = await cashRegistersRepository.create({
      businessUnitId: crypto.randomUUID(),
      operatorId: crypto.randomUUID(),
      status: CashRegisterStatus.OPEN,
      openedAt: new Date("2026-03-06T08:00:00.000Z"),
      closedAt: null,
    });

    const workShift = await workShiftsRepository.create({
      cashRegisterId: register.id,
      operatorId: register.operatorId,
      openingBalance: 100,
      status: WorkShiftStatus.OPEN,
      startTime: new Date("2026-03-06T08:00:00.000Z"),
    });

    const calculateCashBalanceUseCase = {
      execute: async () => ({ expectedBalance: 180 }),
    };

    const sut = new CloseWorkShiftUseCase(
      cashRegistersRepository,
      workShiftsRepository,
      calculateCashBalanceUseCase as any,
    );

    const result = await sut.execute({
      workShiftId: workShift.id,
      closingBalance: 180,
    });

    expect(result.expectedBalance).toBe(180);
    expect(workShiftsRepository.closed).toHaveLength(1);
    expect(workShiftsRepository.closed[0]).toEqual({
      id: workShift.id,
      closingBalance: 180,
    });
  });

  it("should throw when work shift is not found", async () => {
    const calculateCashBalanceUseCase = {
      execute: async () => ({ expectedBalance: 0 }),
    };

    const sut = new CloseWorkShiftUseCase(
      cashRegistersRepository,
      workShiftsRepository,
      calculateCashBalanceUseCase as any,
    );

    await expect(() =>
      sut.execute({
        workShiftId: crypto.randomUUID(),
        closingBalance: 0,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw when work shift is not open", async () => {
    const register = await cashRegistersRepository.create({
      businessUnitId: crypto.randomUUID(),
      operatorId: crypto.randomUUID(),
      status: CashRegisterStatus.OPEN,
      openedAt: new Date(),
      closedAt: null,
    });

    const closedShift = await workShiftsRepository.create({
      cashRegisterId: register.id,
      operatorId: register.operatorId,
      openingBalance: 100,
      status: WorkShiftStatus.CLOSED,
      startTime: new Date(),
    });

    const calculateCashBalanceUseCase = {
      execute: async () => ({ expectedBalance: 100 }),
    };

    const sut = new CloseWorkShiftUseCase(
      cashRegistersRepository,
      workShiftsRepository,
      calculateCashBalanceUseCase as any,
    );

    await expect(() =>
      sut.execute({
        workShiftId: closedShift.id,
        closingBalance: 100,
      }),
    ).rejects.toBeInstanceOf(WorkShiftNotOpenError);
  });

  it("should throw when closing balance mismatches expected balance", async () => {
    const register = await cashRegistersRepository.create({
      businessUnitId: crypto.randomUUID(),
      operatorId: crypto.randomUUID(),
      status: CashRegisterStatus.OPEN,
      openedAt: new Date(),
      closedAt: null,
    });

    const workShift = await workShiftsRepository.create({
      cashRegisterId: register.id,
      operatorId: register.operatorId,
      openingBalance: 100,
      status: WorkShiftStatus.OPEN,
      startTime: new Date(),
    });

    const calculateCashBalanceUseCase = {
      execute: async () => ({ expectedBalance: 200 }),
    };

    const sut = new CloseWorkShiftUseCase(
      cashRegistersRepository,
      workShiftsRepository,
      calculateCashBalanceUseCase as any,
    );

    await expect(() =>
      sut.execute({
        workShiftId: workShift.id,
        closingBalance: 150,
      }),
    ).rejects.toBeInstanceOf(CashBalanceMismatchError);
  });
});
