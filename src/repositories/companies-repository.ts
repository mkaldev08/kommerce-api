import type { Company, Prisma } from 'generated/prisma/client'

export interface CompaniesRepository {
  findById(companyId: string): Promise<Company | null>
  create(data: Prisma.CompanyUncheckedCreateInput): Promise<Company>
  findOneByOwnerId(ownerId: string): Promise<Company | null>
  findAllByOwnerId(ownerId: string): Promise<Company[]>
  findByNif(nif: string): Promise<Company | null>
  findByEmail(email: string): Promise<Company | null>
  findByPhoneNumber(phoneNumber: string): Promise<Company | null>
}
