import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type {
  InventoryProductData,
  InventoryRepository,
} from "@/repositories/inventory-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ListProductsUseCaseRequest {
  businessUnitId: string;
}

interface ListProductsUseCaseResponse {
  products: InventoryProductData[];
}

export class ListProductsUseCase {
  constructor(
    private inventoryRepository: InventoryRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute({
    businessUnitId,
  }: ListProductsUseCaseRequest): Promise<ListProductsUseCaseResponse> {
    const businessUnit =
      await this.businessUnitRepository.findById(businessUnitId);

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    const products =
      await this.inventoryRepository.listByBusinessUnitId(businessUnitId);

    return {
      products,
    };
  }
}
