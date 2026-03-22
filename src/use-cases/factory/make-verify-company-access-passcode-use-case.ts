import { PrismaCompaniesRepository } from "@/repositories/prisma/prisma-companies-repository";
import { VerifyCompanyAccessPasscodeUseCase } from "../verify-company-access-passcode-use-case";

export function MakeVerifyCompanyAccessPasscodeUseCase() {
  const companiesRepository = new PrismaCompaniesRepository();
  const useCase = new VerifyCompanyAccessPasscodeUseCase(companiesRepository);

  return useCase;
}
