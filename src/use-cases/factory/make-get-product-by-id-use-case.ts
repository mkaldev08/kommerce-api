import { PrismaInventoryRepository } from "@/repositories/prisma/prisma-inventory-repository";
import { GetProductByIdUseCase } from "../get-product-by-id-use-case";

export function MakeGetProductByIdUseCase() {
  const inventoryRepository = new PrismaInventoryRepository();
  const useCase = new GetProductByIdUseCase(inventoryRepository);

  return useCase;
}
