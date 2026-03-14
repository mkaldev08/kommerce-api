export interface SchoolYearData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSchoolYearInput {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface SchoolYearsRepository {
  create(data: CreateSchoolYearInput): Promise<SchoolYearData>;
  findById(id: string): Promise<SchoolYearData | null>;
  findAll(): Promise<SchoolYearData[]>;
  update(
    id: string,
    data: Partial<CreateSchoolYearInput>,
  ): Promise<SchoolYearData>;
  delete(id: string): Promise<void>;
}
