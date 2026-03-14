export interface ClassData {
  id: string;
  name: string;
  schedule: string;
  instructorId: string;
  instructorName: string;
  schoolYearId: string;
  schoolYearName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassInput {
  name: string;
  schedule: string;
  instructorId: string;
  schoolYearId: string;
}

export interface ClassesRepository {
  create(data: CreateClassInput): Promise<ClassData>;
  findById(id: string): Promise<ClassData | null>;
  findAll(schoolYearId?: string): Promise<ClassData[]>;
  update(id: string, data: Partial<CreateClassInput>): Promise<ClassData>;
  delete(id: string): Promise<void>;
}
