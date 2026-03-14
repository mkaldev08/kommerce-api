import { prisma } from "@/lib/prisma";
import type {
  CreateInstructorInput,
  InstructorData,
  InstructorsRepository,
} from "../instructors-repository";

type InstructorWithBelt = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  belt_id: string;
  belt: { name: string };
  created_at: Date;
  updated_at: Date;
};

export class PrismaInstructorsRepository implements InstructorsRepository {
  async create(data: CreateInstructorInput): Promise<InstructorData> {
    const { firstName, lastName } = this.splitName(data.name);
    const instructor = await prisma.instructor.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: data.phone ?? null,
        belt_id: data.beltId,
      },
      include: { belt: true },
    });
    return this.toInstructorData(instructor);
  }

  async findById(id: string): Promise<InstructorData | null> {
    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: { belt: true },
    });
    return instructor ? this.toInstructorData(instructor) : null;
  }

  async findAll(): Promise<InstructorData[]> {
    const instructors = await prisma.instructor.findMany({
      orderBy: [{ first_name: "asc" }, { last_name: "asc" }],
      include: { belt: true },
    });
    return instructors.map((i) => this.toInstructorData(i));
  }

  async update(
    id: string,
    data: Partial<CreateInstructorInput>,
  ): Promise<InstructorData> {
    const splitName = data.name ? this.splitName(data.name) : null;
    const instructor = await prisma.instructor.update({
      where: { id },
      data: {
        first_name: splitName?.firstName,
        last_name: splitName?.lastName,
        email: data.email,
        phone: data.phone !== undefined ? data.phone : undefined,
        belt_id: data.beltId,
      },
      include: { belt: true },
    });
    return this.toInstructorData(instructor);
  }

  async delete(id: string): Promise<void> {
    await prisma.instructor.delete({ where: { id } });
  }

  private toInstructorData(instructor: InstructorWithBelt): InstructorData {
    return {
      id: instructor.id,
      name: `${instructor.first_name} ${instructor.last_name}`.trim(),
      email: instructor.email,
      phone: instructor.phone,
      beltId: instructor.belt_id,
      beltName: instructor.belt.name,
      createdAt: instructor.created_at,
      updatedAt: instructor.updated_at,
    };
  }

  private splitName(name: string): { firstName: string; lastName: string } {
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] ?? name;
    const lastName = parts.slice(1).join(" ") || firstName;
    return { firstName, lastName };
  }
}
