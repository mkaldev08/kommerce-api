import type {
  CustomerData,
  CustomersRepository,
  CreateCustomerInput,
} from "@/repositories/customers-repository";

export class CreateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(input: CreateCustomerInput): Promise<CustomerData> {
    return this.customersRepository.create(input);
  }
}
