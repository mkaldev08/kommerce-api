import type {
  InventoryProductData,
  InventoryRepository,
} from "@/repositories/inventory-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetProductByIdUseCaseRequest {
  productId: string;
  businessUnitId: string;
}

interface GetProductByIdUseCaseResponse {
  product: InventoryProductData;
}

export class GetProductByIdUseCase {
  constructor(private inventoryRepository: InventoryRepository) {}

  async execute({
    productId,
    businessUnitId,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.inventoryRepository.findByIdAndBusinessUnitId(
      productId,
      businessUnitId,
    );

    if (!product) {
      throw new ResourceNotFoundError();
    }

    return {
      product,
    };
  }
}
