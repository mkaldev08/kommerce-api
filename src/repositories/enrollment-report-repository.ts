export interface EnrollmentReportData {
  id: string;
  businessUnitId: string;
  businessUnitName: string;
  studentName: string;
  studentPhone?: string | null;
  className: string;
  classSchedule: string;
  schoolYearName: string;
  instructorName: string;
  startDate: Date;
  endDate?: Date | null;
}

export interface EnrollmentReportRepository {
  findByEnrollmentId(enrollmentId: string): Promise<EnrollmentReportData | null>;
}
