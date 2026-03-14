export interface InstructorData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  beltId: string;
  beltName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInstructorInput {
  name: string;
  email: string;
  phone?: string | null;
  beltId: string;
}

export interface InstructorsRepository {
  create(data: CreateInstructorInput): Promise<InstructorData>;
  findById(id: string): Promise<InstructorData | null>;
  findAll(): Promise<InstructorData[]>;
  update(
    id: string,
    data: Partial<CreateInstructorInput>,
  ): Promise<InstructorData>;
  delete(id: string): Promise<void>;
}
