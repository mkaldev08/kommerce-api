import type {
  CustomerData,
  CustomersRepository,
} from "@/repositories/customers-repository";

interface ListCustomersUseCaseResponse {
  customers: CustomerData[];
}

export class ListCustomersUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(): Promise<ListCustomersUseCaseResponse> {
    const customers = await this.customersRepository.findAll();

    return {
      customers,
    };
  }
}
