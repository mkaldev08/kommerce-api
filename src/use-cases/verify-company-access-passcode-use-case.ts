import { compare } from "bcryptjs";
import type { CompaniesRepository } from "@/repositories/companies-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface VerifyCompanyAccessPasscodeUseCaseParams {
  companyId: string;
  access_passcode: string;
}

interface VerifyCompanyAccessPasscodeUseCaseResponse {
  is_valid: boolean;
}

export class VerifyCompanyAccessPasscodeUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute(
    params: VerifyCompanyAccessPasscodeUseCaseParams,
  ): Promise<VerifyCompanyAccessPasscodeUseCaseResponse> {
    const company = await this.companiesRepository.findById(params.companyId);

    if (!company) {
      throw new ResourceNotFoundError();
    }

    if (!company.access_passcode_hash) {
      return {
        is_valid: true,
      };
    }

    const isValid = await compare(
      params.access_passcode,
      company.access_passcode_hash,
    );

    return {
      is_valid: isValid,
    };
  }
}
