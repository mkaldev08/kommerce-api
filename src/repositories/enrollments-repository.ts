export interface EnrollmentData {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone?: string | null;
  classId: string;
  className: string;
  classSchedule: string;
  schoolYearId: string;
  schoolYearName: string;
  instructorName: string;
  businessUnitId: string;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEnrollmentInput {
  studentId: string;
  classId: string;
  businessUnitId: string;
  startDate: Date;
  endDate?: Date | null;
}

export interface EnrollmentsRepository {
  create(data: CreateEnrollmentInput): Promise<EnrollmentData>;
  findById(id: string): Promise<EnrollmentData | null>;
  findManyByBusinessUnitId(businessUnitId: string): Promise<EnrollmentData[]>;
  update(
    id: string,
    data: Partial<
      Pick<CreateEnrollmentInput, "classId" | "startDate" | "endDate">
    >,
  ): Promise<EnrollmentData>;
  delete(id: string): Promise<void>;
}
