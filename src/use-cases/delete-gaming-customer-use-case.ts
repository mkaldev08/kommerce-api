import type { GamingCustomersRepository } from "@/repositories/gaming-customers-repository";

interface DeleteGamingCustomerUseCaseRequest {
  id: string;
}

export class DeleteGamingCustomerUseCase {
  constructor(private gamingCustomersRepository: GamingCustomersRepository) {}

  async execute(request: DeleteGamingCustomerUseCaseRequest): Promise<void> {
    await this.gamingCustomersRepository.delete(request.id);
  }
}
