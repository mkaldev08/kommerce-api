import { prisma } from "@/lib/prisma";
import type {
  CreateEnrollmentInput,
  EnrollmentData,
  EnrollmentsRepository,
} from "../enrollments-repository";

type EnrollmentWithRelations = {
  id: string;
  student_id: string;
  class_id: string;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
  student: {
    first_name: string;
    last_name: string;
    phone: string | null;
    business_unit_id: string;
  };
  class: {
    name: string;
    schedule: string;
    instructor: { first_name: string; last_name: string };
    school_year: { id: string; name: string };
  };
};

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  async create(data: CreateEnrollmentInput): Promise<EnrollmentData> {
    const enrollment = await prisma.enrollment.create({
      data: {
        student_id: data.studentId,
        class_id: data.classId,
        start_date: data.startDate,
        end_date: data.endDate ?? null,
      },
      include: this.includeRelations(),
    });
    return this.toEnrollmentData(enrollment);
  }

  async findById(id: string): Promise<EnrollmentData | null> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: this.includeRelations(),
    });
    return enrollment ? this.toEnrollmentData(enrollment) : null;
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<EnrollmentData[]> {
    const enrollments = await prisma.enrollment.findMany({
      where: { student: { business_unit_id: businessUnitId } },
      orderBy: { start_date: "desc" },
      include: this.includeRelations(),
    });
    return enrollments.map((e) => this.toEnrollmentData(e));
  }

  async update(
    id: string,
    data: Partial<
      Pick<CreateEnrollmentInput, "classId" | "startDate" | "endDate">
    >,
  ): Promise<EnrollmentData> {
    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        class_id: data.classId,
        start_date: data.startDate,
        end_date: data.endDate !== undefined ? data.endDate : undefined,
      },
      include: this.includeRelations(),
    });
    return this.toEnrollmentData(enrollment);
  }

  async delete(id: string): Promise<void> {
    await prisma.enrollment.delete({ where: { id } });
  }

  private includeRelations() {
    return {
      student: {
        select: {
          first_name: true,
          last_name: true,
          phone: true,
          business_unit_id: true,
        },
      },
      class: {
        include: {
          instructor: {
            select: { first_name: true, last_name: true },
          },
          school_year: {
            select: { id: true, name: true },
          },
        },
      },
    };
  }

  private toEnrollmentData(
    enrollment: EnrollmentWithRelations,
  ): EnrollmentData {
    return {
      id: enrollment.id,
      studentId: enrollment.student_id,
      studentName:
        `${enrollment.student.first_name} ${enrollment.student.last_name}`.trim(),
      studentPhone: enrollment.student.phone,
      classId: enrollment.class_id,
      className: enrollment.class.name,
      classSchedule: enrollment.class.schedule,
      schoolYearId: enrollment.class.school_year.id,
      schoolYearName: enrollment.class.school_year.name,
      instructorName:
        `${enrollment.class.instructor.first_name} ${enrollment.class.instructor.last_name}`.trim(),
      businessUnitId: enrollment.student.business_unit_id,
      startDate: enrollment.start_date,
      endDate: enrollment.end_date,
      createdAt: enrollment.created_at,
      updatedAt: enrollment.updated_at,
    };
  }
}
