import { prisma } from "@/lib/prisma";
import type {
  CreateCustomerInput,
  CustomersRepository,
  CustomerData,
} from "../customers-repository";
import { Customer } from "generated/prisma/client";

export class PrismaCustomersRepository implements CustomersRepository {
  async create(data: CreateCustomerInput): Promise<CustomerData> {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone_number: data.phoneNumber || null,
        nif: data.nif || null,
        municipality_id: data.municipalityId,
        street_address: data.streetAddress || null,
        postal_code: data.postalCode || null,
      },
    });

    return this.toCustomerData(customer);
  }

  async findById(id: string): Promise<CustomerData | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { municipality: true },
    });

    return customer ? this.toCustomerData(customer) : null;
  }

  async findAll(): Promise<CustomerData[]> {
    const customers = await prisma.customer.findMany({
      include: { municipality: true },
      orderBy: { name: "asc" },
    });

    return customers.map(this.toCustomerData);
  }

  async update(
    id: string,
    data: Partial<CreateCustomerInput>,
  ): Promise<CustomerData> {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email !== undefined ? data.email : undefined,
        phone_number:
          data.phoneNumber !== undefined ? data.phoneNumber : undefined,
        nif: data.nif !== undefined ? data.nif : undefined,
        municipality_id: data.municipalityId,
        street_address:
          data.streetAddress !== undefined ? data.streetAddress : undefined,
        postal_code:
          data.postalCode !== undefined ? data.postalCode : undefined,
      },
    });

    return this.toCustomerData(customer);
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id },
    });
  }

  private toCustomerData(customer: Customer): CustomerData {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phone_number,
      nif: customer.nif,
      municipalityId: customer.municipality_id,
      streetAddress: customer.street_address,
      postalCode: customer.postal_code,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
    };
  }
}
