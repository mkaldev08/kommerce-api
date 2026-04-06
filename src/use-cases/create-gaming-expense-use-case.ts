import type {
    CreateGamingExpenseInput,
    GamingExpenseData,
    GamingExpensesRepository,
} from "@/repositories/gaming-expenses-repository";

interface CreateGamingExpenseUseCaseResponse {
  expense: GamingExpenseData;
}

export class CreateGamingExpenseUseCase {
  constructor(private gamingExpensesRepository: GamingExpensesRepository) {}

  async execute(
    input: CreateGamingExpenseInput,
  ): Promise<CreateGamingExpenseUseCaseResponse> {
    const expense = await this.gamingExpensesRepository.create(input);

    return { expense };
  }
}
