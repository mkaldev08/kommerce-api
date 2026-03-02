export interface CustomerData {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  nif?: string | null;
  municipalityId: string;
  streetAddress?: string | null;
  postalCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  nif?: string | null;
  municipalityId: string;
  streetAddress?: string | null;
  postalCode?: string | null;
}

export interface CustomersRepository {
  create(data: CreateCustomerInput): Promise<CustomerData>;
  findById(id: string): Promise<CustomerData | null>;
  findAll(): Promise<CustomerData[]>;
  update(id: string, data: Partial<CreateCustomerInput>): Promise<CustomerData>;
  delete(id: string): Promise<void>;
}
