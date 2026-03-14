export interface BeltData {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBeltInput {
  name: string;
  description?: string | null;
}

export interface BeltsRepository {
  create(data: CreateBeltInput): Promise<BeltData>;
  findById(id: string): Promise<BeltData | null>;
  findAll(): Promise<BeltData[]>;
  update(id: string, data: Partial<CreateBeltInput>): Promise<BeltData>;
  delete(id: string): Promise<void>;
}
