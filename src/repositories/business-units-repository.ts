import type { BusinessUnitType } from "generated/prisma/enums";

export interface BusinessUnitSummary {
  id: string;
  companyId: string;
  type: BusinessUnitType;
}

export interface BusinessUnitsRepository {
  findById(id: string): Promise<BusinessUnitSummary | null>;
}
