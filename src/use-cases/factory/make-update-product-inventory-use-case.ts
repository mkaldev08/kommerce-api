import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaInventoryRepository } from "@/repositories/prisma/prisma-inventory-repository";
import { UpdateProductInventoryUseCase } from "../update-product-inventory-use-case";

export function MakeUpdateProductInventoryUseCase() {
  const inventoryRepository = new PrismaInventoryRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();

  const useCase = new UpdateProductInventoryUseCase(
    inventoryRepository,
    businessUnitRepository,
  );

  return useCase;
}
