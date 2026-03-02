import type { Category } from "../../generated/prisma/client";
import type { CategoryRepository } from "@/repositories/category-repository";

interface ListCategoriesUseCaseResponse {
  categories: Category[];
}

export class ListCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(): Promise<ListCategoriesUseCaseResponse> {
    const categories = await this.categoryRepository.findAll();

    return {
      categories,
    };
  }
}
