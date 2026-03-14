import { prisma } from "@/lib/prisma";
import type {
  CreateSchoolYearInput,
  SchoolYearData,
  SchoolYearsRepository,
} from "../school-years-repository";
import type { SchoolYear } from "../../../generated/prisma/client";

export class PrismaSchoolYearsRepository implements SchoolYearsRepository {
  async create(data: CreateSchoolYearInput): Promise<SchoolYearData> {
    const schoolYear = await prisma.schoolYear.create({
      data: {
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
      },
    });
    return this.toSchoolYearData(schoolYear);
  }

  async findById(id: string): Promise<SchoolYearData | null> {
    const schoolYear = await prisma.schoolYear.findUnique({ where: { id } });
    return schoolYear ? this.toSchoolYearData(schoolYear) : null;
  }

  async findAll(): Promise<SchoolYearData[]> {
    const schoolYears = await prisma.schoolYear.findMany({
      orderBy: { start_date: "desc" },
    });
    return schoolYears.map((sy) => this.toSchoolYearData(sy));
  }

  async update(
    id: string,
    data: Partial<CreateSchoolYearInput>,
  ): Promise<SchoolYearData> {
    const schoolYear = await prisma.schoolYear.update({
      where: { id },
      data: {
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
      },
    });
    return this.toSchoolYearData(schoolYear);
  }

  async delete(id: string): Promise<void> {
    await prisma.schoolYear.delete({ where: { id } });
  }

  private toSchoolYearData(schoolYear: SchoolYear): SchoolYearData {
    return {
      id: schoolYear.id,
      name: schoolYear.name,
      startDate: schoolYear.start_date,
      endDate: schoolYear.end_date,
      createdAt: schoolYear.created_at,
      updatedAt: schoolYear.updated_at,
    };
  }
}
