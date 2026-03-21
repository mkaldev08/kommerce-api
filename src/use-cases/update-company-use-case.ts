import type { Company, VATRegime } from "generated/prisma/client";
import type { CompaniesRepository } from "@/repositories/companies-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateCompanyUseCaseParams {
  companyId: string;
  legal_name?: string;
  trade_name?: string;
  document_code_prefix?: string;
  vat_regime?: VATRegime;
  share_capital?: number;
  street_address?: string;
  postal_code?: string | null;
  municipality_id?: string;
}

interface UpdateCompanyUseCaseResponse {
  company: Company;
}

export class UpdateCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute(
    params: UpdateCompanyUseCaseParams,
  ): Promise<UpdateCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(params.companyId);

    if (!company) {
      throw new ResourceNotFoundError();
    }

    const updatedCompany = await this.companiesRepository.update(
      params.companyId,
      {
        legal_name: params.legal_name,
        trade_name: params.trade_name,
        document_code_prefix: params.document_code_prefix,
        vat_regime: params.vat_regime,
        share_capital: params.share_capital,
        street_address: params.street_address,
        postal_code: params.postal_code,
        municipality_id: params.municipality_id,
      },
    );

    return {
      company: updatedCompany,
    };
  }
}
