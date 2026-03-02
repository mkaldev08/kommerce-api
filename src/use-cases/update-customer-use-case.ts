import type {
  CustomerData,
  CustomersRepository,
  CreateCustomerInput,
} from "@/repositories/customers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateCustomerUseCaseRequest extends Partial<CreateCustomerInput> {
  id: string;
}

interface UpdateCustomerUseCaseResponse {
  customer: CustomerData;
}

export class UpdateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(
    request: UpdateCustomerUseCaseRequest,
  ): Promise<UpdateCustomerUseCaseResponse> {
    const { id, ...data } = request;

    const existingCustomer = await this.customersRepository.findById(id);

    if (!existingCustomer) {
      throw new ResourceNotFoundError("Customer not found");
    }

    const customer = await this.customersRepository.update(id, data);

    return {
      customer,
    };
  }
}
