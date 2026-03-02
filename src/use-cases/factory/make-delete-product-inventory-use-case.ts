import { PrismaInventoryRepository } from "@/repositories/prisma/prisma-inventory-repository";
import { DeleteProductInventoryUseCase } from "../delete-product-inventory-use-case";

export function MakeDeleteProductInventoryUseCase() {
  const inventoryRepository = new PrismaInventoryRepository();
  const useCase = new DeleteProductInventoryUseCase(inventoryRepository);

  return useCase;
}
