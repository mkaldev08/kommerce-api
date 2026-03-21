import type { Company } from "generated/prisma/client";
import type { CompanyUncheckedCreateInput } from "generated/prisma/models";
import { prisma } from "@/lib/prisma";
import type {
  CompaniesRepository,
  UpdateCompanyInput,
} from "../companies-repository";

export class PrismaCompaniesRepository implements CompaniesRepository {
  async findByNif(nif: string) {
    const company = await prisma.company.findUnique({
      where: {
        nif,
      },
    });

    return company;
  }

  async findById(companyId: string) {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    return company;
  }
  async create(data: CompanyUncheckedCreateInput): Promise<Company> {
    const company = await prisma.company.create({
      data,
    });

    return company;
  }

  async update(companyId: string, data: UpdateCompanyInput): Promise<Company> {
    const company = await prisma.company.update({
      where: {
        id: companyId,
      },
      data,
    });

    return company;
  }

  async updateLogo(
    companyId: string,
    imageData: string,
    imageType: string,
  ): Promise<void> {
    await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        image_data: imageData,
        image_type: imageType,
      },
    });
  }

  async findOneByOwnerId(ownerId: string) {
    const company = await prisma.company.findFirst({
      where: {
        owner_id: ownerId,
      },
    });

    return company;
  }
  async findAllByOwnerId(ownerId: string): Promise<Company[]> {
    const companies = await prisma.company.findMany({
      where: {
        owner_id: ownerId,
      },
    });

    return companies;
  }
  async findByCommercialRegistry(commercialRegistry: string) {
    const company = await prisma.company.findUnique({
      where: {
        commercial_registry: commercialRegistry,
      },
    });

    return company;
  }
  async findByEmail(email: string) {
    const company = await prisma.company.findUnique({
      where: {
        email,
      },
    });

    return company;
  }
  async findByPhoneNumber(phoneNumber: string) {
    const company = await prisma.company.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    });

    return company;
  }
}
