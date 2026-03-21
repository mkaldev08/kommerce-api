import type {
  BusinessUnitType,
  Company,
  VATRegime,
} from "generated/prisma/client";
import type { BusinessUnitRepository } from "@/repositories/business-unit-repository";
import type { CompaniesRepository } from "@/repositories/companies-repository";
import type { UsersRepository } from "@/repositories/users-repository";
import { CompanyAlreadyExistsError } from "./errors/company-already-exists-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

// Map old regime values to VATRegime enum (for backward compatibility)
export enum Regime {
  SIMPLIFICADO = "SIMPLIFIED",
  EXCLUSAO = "EXEMPTION",
  GERAL = "GENERAL",
}

interface CreateCompanyUseCaseParams {
  id?: string;
  trade_name: string;
  created_at?: Date | string;
  nif: string;
  commercial_registry: string;
  document_code_prefix: string;
  legal_name: string;
  updated_at?: Date | string;
  vat_regime?: VATRegime;
  share_capital?: number;
  owner_id: string;
  email: string;
  phone_number: string;
  street_address: string;
  postal_code?: string | null;
  municipality_id: string;
}

interface CreateCompanyUseCaseResponse {
  company: Company;
}

export class CreateCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
    private businessUnitRepository: BusinessUnitRepository,
  ) {}

  async execute(
    params: CreateCompanyUseCaseParams,
  ): Promise<CreateCompanyUseCaseResponse> {
    const [
      user,
      existingCompanyByNif,
      existingCompany,
      existingCompanyByEmail,
      existingCompanyByPhoneNumber,
    ] = await Promise.all([
      this.usersRepository.findById(params.owner_id),
      this.companiesRepository.findByNif(params.nif),
      this.companiesRepository.findByCommercialRegistry(
        params.commercial_registry,
      ),
      this.companiesRepository.findByEmail(params.email),
      this.companiesRepository.findByPhoneNumber(params.phone_number),
    ]);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    if (
      existingCompanyByNif ||
      existingCompany ||
      existingCompanyByEmail ||
      existingCompanyByPhoneNumber
    ) {
      throw new CompanyAlreadyExistsError();
    }

    const company = await this.companiesRepository.create({
      id: params.id,
      legal_name: params.legal_name,
      trade_name: params.trade_name,
      nif: params.nif,
      commercial_registry: params.commercial_registry,
      document_code_prefix: params.document_code_prefix,
      email: params.email,
      phone_number: params.phone_number,
      vat_regime: params.vat_regime ?? "SIMPLIFIED",
      share_capital: params.share_capital ?? 0,
      street_address: params.street_address,
      postal_code: params.postal_code ?? null,
      municipality_id: params.municipality_id,
      owner_id: user.id,
    });

    const defaultBusinessUnits: Array<{
      name: string;
      type: BusinessUnitType;
    }> = [
      {
        name: "Loja",
        type: "STORE",
      },
      {
        name: "Academia",
        type: "ACADEMY",
      },
      {
        name: "Casa de Jogos",
        type: "GAMING_HOUSE",
      },
    ];

    await Promise.all(
      defaultBusinessUnits.map((unit) =>
        this.businessUnitRepository.create({
          name: unit.name,
          type: unit.type,
          address: params.street_address,
          company_id: company.id,
        }),
      ),
    );

    return {
      company,
    };
  }
}
