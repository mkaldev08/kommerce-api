import type {
    GamingExpenseData,
    GamingExpensesRepository,
} from "@/repositories/gaming-expenses-repository";

interface ListGamingExpensesUseCaseRequest {
  businessUnitId: string;
}

interface ListGamingExpensesUseCaseResponse {
  expenses: GamingExpenseData[];
}

export class ListGamingExpensesUseCase {
  constructor(private gamingExpensesRepository: GamingExpensesRepository) {}

  async execute(
    request: ListGamingExpensesUseCaseRequest,
  ): Promise<ListGamingExpensesUseCaseResponse> {
    const expenses = await this.gamingExpensesRepository.findManyByBusinessUnitId(
      request.businessUnitId,
    );

    return { expenses };
  }
}
