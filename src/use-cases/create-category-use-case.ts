import type { Category } from "../../generated/prisma/client";
import type { CategoryRepository } from "@/repositories/category-repository";

interface CreateCategoryUseCaseRequest {
  name: string;
}

interface CreateCategoryUseCaseResponse {
  category: Category;
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    name,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = await this.categoryRepository.create(name);

    return {
      category,
    };
  }
}
