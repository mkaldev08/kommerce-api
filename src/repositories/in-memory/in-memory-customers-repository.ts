import { uuidv7 } from 'uuidv7'
import type {
  CreateCustomerInput,
  CustomerData,
  CustomersRepository,
} from '@/modules/store/application/ports/repositories/customers-repository'

export class InMemoryCustomersRepository implements CustomersRepository {
  items: CustomerData[] = []

  async create(data: CreateCustomerInput): Promise<CustomerData> {
    const customer: CustomerData = {
      id: uuidv7(),
      name: data.name,
      email: data.email ?? null,
      phoneNumber: data.phoneNumber ?? null,
      nif: data.nif ?? null,
      municipalityId: data.municipalityId,
    }

    this.items.push(customer)

    return customer
  }

  async findById(id: string): Promise<CustomerData | null> {
    return this.items.find((item) => item.id === id) ?? null
  }
}
