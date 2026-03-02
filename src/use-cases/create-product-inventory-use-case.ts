import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  CreateInventoryProductInput,
  InventoryProductData,
  InventoryRepository,
} from "@/repositories/inventory-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CreateProductInventoryUseCaseResponse {
  product: InventoryProductData;
}

export class CreateProductInventoryUseCase {
  constructor(
    private inventoryRepository: InventoryRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    input: CreateInventoryProductInput,
  ): Promise<CreateProductInventoryUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      input.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    const product = await this.inventoryRepository.create(input);

    return {
      product,
    };
  }
}
