import { prisma } from "@/lib/prisma";
import type {
  BeltData,
  BeltsRepository,
  CreateBeltInput,
} from "../belts-repository";
import type { Belt } from "../../../generated/prisma/client";

export class PrismaBeltsRepository implements BeltsRepository {
  async create(data: CreateBeltInput): Promise<BeltData> {
    const belt = await prisma.belt.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
    return this.toBeltData(belt);
  }

  async findById(id: string): Promise<BeltData | null> {
    const belt = await prisma.belt.findUnique({ where: { id } });
    return belt ? this.toBeltData(belt) : null;
  }

  async findAll(): Promise<BeltData[]> {
    const belts = await prisma.belt.findMany({
      orderBy: { name: "asc" },
    });
    return belts.map((b) => this.toBeltData(b));
  }

  async update(id: string, data: Partial<CreateBeltInput>): Promise<BeltData> {
    const belt = await prisma.belt.update({
      where: { id },
      data: {
        name: data.name,
        description:
          data.description !== undefined ? data.description : undefined,
      },
    });
    return this.toBeltData(belt);
  }

  async delete(id: string): Promise<void> {
    await prisma.belt.delete({ where: { id } });
  }

  private toBeltData(belt: Belt): BeltData {
    return {
      id: belt.id,
      name: belt.name,
      description: belt.description,
      createdAt: belt.created_at,
      updatedAt: belt.updated_at,
    };
  }
}
