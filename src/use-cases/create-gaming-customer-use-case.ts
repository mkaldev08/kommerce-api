import type {
    CreateGamingCustomerInput,
    GamingCustomerData,
    GamingCustomersRepository,
} from "@/repositories/gaming-customers-repository";

interface CreateGamingCustomerUseCaseResponse {
  customer: GamingCustomerData;
}

export class CreateGamingCustomerUseCase {
  constructor(private gamingCustomersRepository: GamingCustomersRepository) {}

  async execute(
    input: CreateGamingCustomerInput,
  ): Promise<CreateGamingCustomerUseCaseResponse> {
    const customer = await this.gamingCustomersRepository.create(input);

    return { customer };
  }
}
