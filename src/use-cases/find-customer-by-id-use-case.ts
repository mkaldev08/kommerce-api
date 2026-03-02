import type {
  CustomerData,
  CustomersRepository,
} from "@/repositories/customers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindCustomerByIdUseCaseRequest {
  id: string;
}

interface FindCustomerByIdUseCaseResponse {
  customer: CustomerData;
}

export class FindCustomerByIdUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(
    request: FindCustomerByIdUseCaseRequest,
  ): Promise<FindCustomerByIdUseCaseResponse> {
    const customer = await this.customersRepository.findById(request.id);

    if (!customer) {
      throw new ResourceNotFoundError("Customer not found");
    }

    return {
      customer,
    };
  }
}
