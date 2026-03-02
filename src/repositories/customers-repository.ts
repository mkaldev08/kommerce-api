export interface CustomerData {
  id: string
  name: string
  email?: string | null
  phoneNumber?: string | null
  nif?: string | null
  municipalityId: string
}

export interface CreateCustomerInput {
  name: string
  email?: string | null
  phoneNumber?: string | null
  nif?: string | null
  municipalityId: string
}

export interface CustomersRepository {
  create(data: CreateCustomerInput): Promise<CustomerData>
  findById(id: string): Promise<CustomerData | null>
}
