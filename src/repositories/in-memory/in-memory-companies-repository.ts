import type { Company } from "generated/prisma/client";
import type { CompanyUncheckedCreateInput } from "generated/prisma/models";
import type {
  CompaniesRepository,
  UpdateCompanyInput,
} from "../companies-repository";

export class InMemoryCompaniesRepository implements CompaniesRepository {
  async update(companyId: string, data: UpdateCompanyInput): Promise<Company> {
    const companyIndex = this.items.findIndex((item) => item.id === companyId);

    if (companyIndex < 0) {
      throw new Error("Company not found");
    }

    const updatedCompany: Company = {
      ...this.items[companyIndex],
      ...data,
      updated_at: new Date(),
    };

    this.items[companyIndex] = updatedCompany;

    return updatedCompany;
  }

  async findByNif(nif: string) {
    return this.items.find((item) => item.nif === nif) || null;
  }

  async updateLogo(
    companyId: string,
    imageData: string,
    imageType: string,
  ): Promise<void> {
    const company = this.items.find((item) => item.id === companyId);
    if (!company) {
      return;
    }

    company.image_data = imageData;
    company.image_type = imageType;
    company.updated_at = new Date();
  }

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) || null;
  }
  async findByPhoneNumber(phoneNumber: string) {
    return this.items.find((item) => item.phone_number === phoneNumber) || null;
  }
  async findAllByOwnerId(ownerId: string) {
    return this.items.filter((item) => item.owner_id === ownerId);
  }
  async findByCommercialRegistry(commercialRegistry: string) {
    return (
      this.items.find(
        (item) => item.commercial_registry === commercialRegistry,
      ) || null
    );
  }
  private items: Company[] = [];
  async findById(companyId: string) {
    const company = this.items.find((item) => item.id === companyId);

    if (!company) return null;
    return company;
  }

  async create(data: CompanyUncheckedCreateInput) {
    const company: Company = {
      id: data.id ?? crypto.randomUUID(),
      legal_name: data.legal_name as string,
      trade_name: data.trade_name as string,
      nif: data.nif as string,
      commercial_registry: data.commercial_registry as string,
      document_code_prefix: data.document_code_prefix as string,
      image_data: (data.image_data as string | null) ?? null,
      image_type: (data.image_type as string | null) ?? null,
      email: data.email as string,
      phone_number: data.phone_number as string,
      vat_regime: data.vat_regime as any,
      share_capital: data.share_capital as any,
      street_address: data.street_address as string,
      postal_code: data.postal_code as string | null,
      municipality_id: data.municipality_id as string,
      owner_id: data.owner_id as string,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.items.push(company);
    return company;
  }
  async findOneByOwnerId(ownerId: string): Promise<Company | null> {
    const company = this.items.find((item) => item.owner_id === ownerId);
    return company || null;
  }
}
