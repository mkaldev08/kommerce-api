import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { CreateCategoryUseCase } from "../create-category-use-case";

export function MakeCreateCategoryUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new CreateCategoryUseCase(categoryRepository);

  return useCase;
}
