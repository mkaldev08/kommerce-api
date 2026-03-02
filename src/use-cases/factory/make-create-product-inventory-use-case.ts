import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaInventoryRepository } from "@/repositories/prisma/prisma-inventory-repository";
import { CreateProductInventoryUseCase } from "../create-product-inventory-use-case";

export function MakeCreateProductInventoryUseCase() {
  const inventoryRepository = new PrismaInventoryRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();

  const useCase = new CreateProductInventoryUseCase(
    inventoryRepository,
    businessUnitRepository,
  );

  return useCase;
}
