import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaInventoryRepository } from "@/repositories/prisma/prisma-inventory-repository";
import { ListProductsUseCase } from "../list-products-use-case";

export function MakeListProductsUseCase() {
  const inventoryRepository = new PrismaInventoryRepository();
  const businessUnitRepository = new PrismaBusinessUnitRepository();

  const useCase = new ListProductsUseCase(
    inventoryRepository,
    businessUnitRepository,
  );

  return useCase;
}
