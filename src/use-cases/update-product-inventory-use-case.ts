import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  InventoryProductData,
  InventoryRepository,
  UpdateInventoryProductInput,
} from "@/repositories/inventory-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateProductInventoryUseCaseRequest {
  productId: string;
  input: UpdateInventoryProductInput;
}

interface UpdateProductInventoryUseCaseResponse {
  product: InventoryProductData;
}

export class UpdateProductInventoryUseCase {
  constructor(
    private inventoryRepository: InventoryRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute({
    productId,
    input,
  }: UpdateProductInventoryUseCaseRequest): Promise<UpdateProductInventoryUseCaseResponse> {
    const businessUnit = await this.businessUnitRepository.findById(
      input.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    const product = await this.inventoryRepository.update(productId, input);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    return {
      product,
    };
  }
}
