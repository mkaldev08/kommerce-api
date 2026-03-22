import type { Company } from "generated/prisma/client";

export interface CompanyResponse extends Omit<Company, "access_passcode_hash"> {
  has_access_passcode: boolean;
}

export function serializeCompany(company: Company): CompanyResponse {
  const { access_passcode_hash: _accessPasscodeHash, ...safeCompany } = company;

  return {
    ...safeCompany,
    has_access_passcode: Boolean(company.access_passcode_hash),
  };
}

export function serializeCompanies(companies: Company[]): CompanyResponse[] {
  return companies.map(serializeCompany);
}
