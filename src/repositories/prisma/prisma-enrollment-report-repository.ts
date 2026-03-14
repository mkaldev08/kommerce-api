import { prisma } from "@/lib/prisma";
import type {
  EnrollmentReportData,
  EnrollmentReportRepository,
} from "../enrollment-report-repository";

export class PrismaEnrollmentReportRepository
  implements EnrollmentReportRepository
{
  async findByEnrollmentId(
    enrollmentId: string,
  ): Promise<EnrollmentReportData | null> {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        student: {
          include: {
            business_unit: true,
          },
        },
        class: {
          include: {
            instructor: true,
            school_year: true,
          },
        },
      },
    });

    if (!enrollment) {
      return null;
    }

    return {
      id: enrollment.id,
      businessUnitId: enrollment.student.business_unit_id,
      businessUnitName: enrollment.student.business_unit.name,
      studentName:
        `${enrollment.student.first_name} ${enrollment.student.last_name}`.trim(),
      studentPhone: enrollment.student.phone,
      className: enrollment.class.name,
      classSchedule: enrollment.class.schedule,
      schoolYearName: enrollment.class.school_year.name,
      instructorName:
        `${enrollment.class.instructor.first_name} ${enrollment.class.instructor.last_name}`.trim(),
      startDate: enrollment.start_date,
      endDate: enrollment.end_date,
    };
  }
}
