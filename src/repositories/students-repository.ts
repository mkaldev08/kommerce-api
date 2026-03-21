export interface StudentData {
  id: string;
  studentNumber: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  guardianName?: string | null;
  guardianPhoneNumber?: string | null;
  notes?: string | null;
  businessUnitId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentInput {
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  guardianName?: string | null;
  guardianPhoneNumber?: string | null;
  notes?: string | null;
  businessUnitId: string;
}

export interface StudentsRepository {
  create(data: CreateStudentInput): Promise<StudentData>;
  findById(id: string): Promise<StudentData | null>;
  findManyByBusinessUnitId(businessUnitId: string): Promise<StudentData[]>;
  update(id: string, data: Partial<CreateStudentInput>): Promise<StudentData>;
  delete(id: string): Promise<void>;
}
