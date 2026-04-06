import type {
    CreateGamingCustomerInput,
    GamingCustomerData,
    GamingCustomersRepository,
} from "@/repositories/gaming-customers-repository";

interface UpdateGamingCustomerUseCaseRequest {
  id: string;
  data: Partial<Omit<CreateGamingCustomerInput, "businessUnitId">>;
}

interface UpdateGamingCustomerUseCaseResponse {
  customer: GamingCustomerData;
}

export class UpdateGamingCustomerUseCase {
  constructor(private gamingCustomersRepository: GamingCustomersRepository) {}

  async execute(
    request: UpdateGamingCustomerUseCaseRequest,
  ): Promise<UpdateGamingCustomerUseCaseResponse> {
    const customer = await this.gamingCustomersRepository.update(
      request.id,
      request.data,
    );

    return { customer };
  }
}
