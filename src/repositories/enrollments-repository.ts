export interface EnrollmentData {
  id: string;
  studentId: string;
  studentNumber: string;
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
  beltId: string;
  businessUnitId: string;
}

export interface CreateEnrollmentPersistenceInput extends CreateEnrollmentInput {
  startDate: Date;
  endDate?: Date | null;
}

export interface UpdateEnrollmentInput {
  classId?: string;
  startDate?: Date;
  endDate?: Date | null;
}

export interface EnrollmentsRepository {
  create(data: CreateEnrollmentPersistenceInput): Promise<EnrollmentData>;
  findById(id: string): Promise<EnrollmentData | null>;
  findManyByBusinessUnitId(businessUnitId: string): Promise<EnrollmentData[]>;
  update(id: string, data: UpdateEnrollmentInput): Promise<EnrollmentData>;
  delete(id: string): Promise<void>;
}
