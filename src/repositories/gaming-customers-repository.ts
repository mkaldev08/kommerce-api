export interface GamingCustomerData {
  id: string;
  businessUnitId: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGamingCustomerInput {
  businessUnitId: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  notes?: string | null;
}

export interface GamingCustomersRepository {
  create(data: CreateGamingCustomerInput): Promise<GamingCustomerData>;
  findById(id: string): Promise<GamingCustomerData | null>;
  findManyByBusinessUnitId(businessUnitId: string): Promise<GamingCustomerData[]>;
  update(
    id: string,
    data: Partial<Omit<CreateGamingCustomerInput, "businessUnitId">>,
  ): Promise<GamingCustomerData>;
  delete(id: string): Promise<void>;
}
