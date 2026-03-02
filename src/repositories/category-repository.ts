import type { Category } from "../../generated/prisma/client";

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  create(name: string): Promise<Category>;
}
