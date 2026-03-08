import type {
  WorkShiftData,
  WorkShiftsRepository,
} from "@/repositories/work-shifts-repository";

interface GetOpenWorkShiftRequest {
  cashRegisterId: string;
}

interface GetOpenWorkShiftResponse {
  workShift: WorkShiftData | null;
}

export class GetOpenWorkShiftUseCase {
  constructor(private workShiftsRepository: WorkShiftsRepository) {}

  async execute(
    request: GetOpenWorkShiftRequest,
  ): Promise<GetOpenWorkShiftResponse> {
    const workShift = await this.workShiftsRepository.findOpenByCashRegisterId(
      request.cashRegisterId,
    );

    return { workShift };
  }
}
