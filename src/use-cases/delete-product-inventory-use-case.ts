import type { InventoryRepository } from "@/repositories/inventory-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteProductInventoryUseCaseRequest {
  productId: string;
}

export class DeleteProductInventoryUseCase {
  constructor(private inventoryRepository: InventoryRepository) {}

  async execute({
    productId,
  }: DeleteProductInventoryUseCaseRequest): Promise<void> {
    const deleted = await this.inventoryRepository.delete(productId);

    if (!deleted) {
      throw new ResourceNotFoundError();
    }
  }
}
