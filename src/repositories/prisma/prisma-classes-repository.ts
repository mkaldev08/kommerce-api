import { prisma } from "@/lib/prisma";
import type {
  ClassData,
  ClassesRepository,
  CreateClassInput,
} from "../classes-repository";

type ClassWithRelations = {
  id: string;
  name: string;
  schedule: string;
  instructor_id: string;
  school_year_id: string;
  instructor: { first_name: string; last_name: string };
  school_year: { name: string };
  created_at: Date;
  updated_at: Date;
};

export class PrismaClassesRepository implements ClassesRepository {
  async create(data: CreateClassInput): Promise<ClassData> {
    const cls = await prisma.class.create({
      data: {
        name: data.name,
        schedule: data.schedule,
        instructor_id: data.instructorId,
        school_year_id: data.schoolYearId,
      },
      include: { instructor: true, school_year: true },
    });
    return this.toClassData(cls);
  }

  async findById(id: string): Promise<ClassData | null> {
    const cls = await prisma.class.findUnique({
      where: { id },
      include: { instructor: true, school_year: true },
    });
    return cls ? this.toClassData(cls) : null;
  }

  async findAll(schoolYearId?: string): Promise<ClassData[]> {
    const classes = await prisma.class.findMany({
      where: schoolYearId ? { school_year_id: schoolYearId } : undefined,
      orderBy: { name: "asc" },
      include: { instructor: true, school_year: true },
    });
    return classes.map((c) => this.toClassData(c));
  }

  async update(
    id: string,
    data: Partial<CreateClassInput>,
  ): Promise<ClassData> {
    const cls = await prisma.class.update({
      where: { id },
      data: {
        name: data.name,
        schedule: data.schedule,
        instructor_id: data.instructorId,
        school_year_id: data.schoolYearId,
      },
      include: { instructor: true, school_year: true },
    });
    return this.toClassData(cls);
  }

  async delete(id: string): Promise<void> {
    await prisma.class.delete({ where: { id } });
  }

  private toClassData(cls: ClassWithRelations): ClassData {
    return {
      id: cls.id,
      name: cls.name,
      schedule: cls.schedule,
      instructorId: cls.instructor_id,
      instructorName:
        `${cls.instructor.first_name} ${cls.instructor.last_name}`.trim(),
      schoolYearId: cls.school_year_id,
      schoolYearName: cls.school_year.name,
      createdAt: cls.created_at,
      updatedAt: cls.updated_at,
    };
  }
}
