import type { Company, Prisma } from "generated/prisma/client";

export interface UpdateCompanyInput {
  legal_name?: string;
  trade_name?: string;
  document_code_prefix?: string;
  vat_regime?: Prisma.EnumVATRegimeFieldUpdateOperationsInput | string;
  share_capital?: Prisma.Decimal | number;
  street_address?: string;
  postal_code?: string | null;
  municipality_id?: string;
  access_passcode_hash?: string | null;
}

export interface CompaniesRepository {
  findById(companyId: string): Promise<Company | null>;
  create(data: Prisma.CompanyUncheckedCreateInput): Promise<Company>;
  update(companyId: string, data: UpdateCompanyInput): Promise<Company>;
  updateLogo(
    companyId: string,
    imageData: string,
    imageType: string,
  ): Promise<void>;
  findOneByOwnerId(ownerId: string): Promise<Company | null>;
  findAllByOwnerId(ownerId: string): Promise<Company[]>;
  findByNif(nif: string): Promise<Company | null>;
  findByCommercialRegistry(commercialRegistry: string): Promise<Company | null>;
  findByEmail(email: string): Promise<Company | null>;
  findByPhoneNumber(phoneNumber: string): Promise<Company | null>;
}
