import type {
  CashMovementData,
  CashMovementsRepository,
} from "@/repositories/cash-movements-repository";

interface ListCashMovementsRequest {
  cashRegisterId: string;
  from: Date;
  to: Date;
}

interface ListCashMovementsResponse {
  movements: CashMovementData[];
}

export class ListCashMovementsUseCase {
  constructor(private cashMovementsRepository: CashMovementsRepository) {}

  async execute(
    request: ListCashMovementsRequest,
  ): Promise<ListCashMovementsResponse> {
    const movements = await this.cashMovementsRepository.listByRegisterBetween(
      request.cashRegisterId,
      request.from,
      request.to,
    );

    return { movements };
  }
}
