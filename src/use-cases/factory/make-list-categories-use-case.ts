import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { ListCategoriesUseCase } from "../list-categories-use-case";

export function MakeListCategoriesUseCase() {
  const categoryRepository = new PrismaCategoryRepository();
  const useCase = new ListCategoriesUseCase(categoryRepository);

  return useCase;
}
