import type {
    GamingCustomerData,
    GamingCustomersRepository,
} from "@/repositories/gaming-customers-repository";

interface ListGamingCustomersUseCaseRequest {
  businessUnitId: string;
}

interface ListGamingCustomersUseCaseResponse {
  customers: GamingCustomerData[];
}

export class ListGamingCustomersUseCase {
  constructor(private gamingCustomersRepository: GamingCustomersRepository) {}

  async execute(
    request: ListGamingCustomersUseCaseRequest,
  ): Promise<ListGamingCustomersUseCaseResponse> {
    const customers =
      await this.gamingCustomersRepository.findManyByBusinessUnitId(
        request.businessUnitId,
      );

    return { customers };
  }
}
