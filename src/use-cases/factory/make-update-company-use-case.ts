import { PrismaCompaniesRepository } from "@/repositories/prisma/prisma-companies-repository";
import { UpdateCompanyUseCase } from "../update-company-use-case";

export function MakeUpdateCompanyUseCase() {
  const companiesRepository = new PrismaCompaniesRepository();
  const useCase = new UpdateCompanyUseCase(companiesRepository);

  return useCase;
}
