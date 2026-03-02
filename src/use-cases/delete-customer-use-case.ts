import type { CustomersRepository } from "@/repositories/customers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteCustomerUseCaseRequest {
  id: string;
}

export class DeleteCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(request: DeleteCustomerUseCaseRequest): Promise<void> {
    const existingCustomer = await this.customersRepository.findById(
      request.id,
    );

    if (!existingCustomer) {
      throw new ResourceNotFoundError("Customer not found");
    }

    await this.customersRepository.delete(request.id);
  }
}
