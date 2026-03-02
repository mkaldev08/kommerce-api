import type { Category } from "../../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CategoryRepository } from "../category-repository";

export class PrismaCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  }

  async create(name: string): Promise<Category> {
    const category = await prisma.category.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });

    return category;
  }
}
