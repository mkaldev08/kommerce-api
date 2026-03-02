import type { WorkShiftStatus } from '@/modules/store/domain/enums'

export interface WorkShiftData {
  id: string
  startTime: Date
  endTime?: Date | null
  openingBalance: number
  closingBalance?: number | null
  status: WorkShiftStatus
  operatorId: string
  cashRegisterId: string
}

export interface CreateWorkShiftInput {
  startTime?: Date
  openingBalance: number
  status: WorkShiftStatus
  operatorId: string
  cashRegisterId: string
}

export interface WorkShiftsRepository {
  create(data: CreateWorkShiftInput): Promise<WorkShiftData>
  findById(id: string): Promise<WorkShiftData | null>
  findOpenByCashRegisterAndOperator(
    cashRegisterId: string,
    operatorId: string,
  ): Promise<WorkShiftData | null>
  findOpenByCashRegisterId(
    cashRegisterId: string,
  ): Promise<WorkShiftData | null>
  close(id: string, closingBalance: number, endTime?: Date): Promise<void>
}
