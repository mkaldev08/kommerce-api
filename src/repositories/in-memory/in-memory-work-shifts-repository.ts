import { uuidv7 } from 'uuidv7'
import type {
  CreateWorkShiftInput,
  WorkShiftData,
  WorkShiftsRepository,
} from '@/modules/store/application/ports/repositories/work-shifts-repository'

export class InMemoryWorkShiftsRepository implements WorkShiftsRepository {
  items: WorkShiftData[] = []

  async create(data: CreateWorkShiftInput): Promise<WorkShiftData> {
    const workShift: WorkShiftData = {
      id: uuidv7(),
      startTime: data.startTime ?? new Date(),
      endTime: null,
      openingBalance: data.openingBalance,
      closingBalance: null,
      status: data.status,
      operatorId: data.operatorId,
      cashRegisterId: data.cashRegisterId,
    }

    this.items.push(workShift)

    return workShift
  }

  async findById(id: string): Promise<WorkShiftData | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findOpenByCashRegisterAndOperator(
    cashRegisterId: string,
    operatorId: string,
  ): Promise<WorkShiftData | null> {
    return (
      this.items.find(
        (item) =>
          item.cashRegisterId === cashRegisterId &&
          item.operatorId === operatorId &&
          item.status === 'OPEN',
      ) ?? null
    )
  }

  async findOpenByCashRegisterId(
    cashRegisterId: string,
  ): Promise<WorkShiftData | null> {
    return (
      this.items.find(
        (item) =>
          item.cashRegisterId === cashRegisterId && item.status === 'OPEN',
      ) ?? null
    )
  }

  async close(
    id: string,
    closingBalance: number,
    endTime?: Date,
  ): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)

    if (index === -1) {
      throw new Error('Work shift not found')
    }

    this.items[index] = {
      ...this.items[index],
      closingBalance,
      endTime: endTime ?? new Date(),
      status: 'CLOSED',
    }
  }
}
