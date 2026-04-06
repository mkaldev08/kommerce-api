import type { GamingCustomer } from "generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
    CreateGamingCustomerInput,
    GamingCustomerData,
    GamingCustomersRepository,
} from "../gaming-customers-repository";

export class PrismaGamingCustomersRepository
  implements GamingCustomersRepository
{
  async create(data: CreateGamingCustomerInput): Promise<GamingCustomerData> {
    const customer = await prisma.gamingCustomer.create({
      data: {
        business_unit_id: data.businessUnitId,
        name: data.name,
        email: data.email || null,
        phone_number: data.phoneNumber || null,
        notes: data.notes || null,
      },
    });

    return this.toGamingCustomerData(customer);
  }

  async findById(id: string): Promise<GamingCustomerData | null> {
    const customer = await prisma.gamingCustomer.findUnique({
      where: { id },
    });

    return customer ? this.toGamingCustomerData(customer) : null;
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<GamingCustomerData[]> {
    const customers = await prisma.gamingCustomer.findMany({
      where: { business_unit_id: businessUnitId },
      orderBy: { name: "asc" },
    });

    return customers.map((customer) => this.toGamingCustomerData(customer));
  }

  async update(
    id: string,
    data: Partial<Omit<CreateGamingCustomerInput, "businessUnitId">>,
  ): Promise<GamingCustomerData> {
    const customer = await prisma.gamingCustomer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email !== undefined ? data.email : undefined,
        phone_number: data.phoneNumber !== undefined ? data.phoneNumber : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
      },
    });

    return this.toGamingCustomerData(customer);
  }

  async delete(id: string): Promise<void> {
    await prisma.gamingCustomer.delete({
      where: { id },
    });
  }

  private toGamingCustomerData(customer: GamingCustomer): GamingCustomerData {
    return {
      id: customer.id,
      businessUnitId: customer.business_unit_id,
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phone_number,
      notes: customer.notes,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
    };
  }
}
