import type { Company } from 'generated/prisma/client'
import type { CompanyUncheckedCreateInput } from 'generated/prisma/models'
import { prisma } from '@/lib/prisma'
import type { CompaniesRepository } from '../companies-repository'

export class PrismaCompaniesRepository implements CompaniesRepository {
  async findById(companyId: string) {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    })

    return company
  }
  async create(data: CompanyUncheckedCreateInput): Promise<Company> {
    const company = await prisma.company.create({
      data,
    })

    return company
  }
  async findOneByOwnerId(ownerId: string) {
    const company = await prisma.company.findFirst({
      where: {
        user_owner_id: ownerId,
      },
    })

    return company
  }
  async findAllByOwnerId(ownerId: string): Promise<Company[]> {
    const companies = await prisma.company.findMany({
      where: {
        user_owner_id: ownerId,
      },
    })

    return companies
  }
  async findByNif(nif: string) {
    const company = await prisma.company.findUnique({
      where: {
        nif,
      },
    })

    return company
  }
  async findByEmail(email: string) {
    const company = await prisma.company.findUnique({
      where: {
        email,
      },
    })

    return company
  }
  async findByPhoneNumber(phoneNumber: string) {
    const company = await prisma.company.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    })

    return company
  }
}
