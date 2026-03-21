import type {
  InvoicesRepository,
  InvoiceData,
} from "../repositories/invoices-repository";
import type { BusinessUnitRepository } from "../repositories/business-unit-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export interface SaleData {
  id: string;
  number: string;
  series: string;
  type: string;
  companyDocumentCode?: string;
  issueDate: Date;
  taxableAmount: number;
  vatAmount: number;
  totalAmount: number;
  status: string;
  pendingReason?: string | null;
  cancelReason?: string | null;
  companyId: string;
  businessUnitId: string;
  customerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ListInvoicesRequest {
  businessUnitId: string;
}

interface ListInvoicesResponse {
  sales: SaleData[];
}

export class ListInvoicesUseCase {
  constructor(
    private invoicesRepository: InvoicesRepository,
    private businessUnitsRepository: BusinessUnitRepository,
  ) {}

  async execute(request: ListInvoicesRequest): Promise<ListInvoicesResponse> {
    const businessUnit = await this.businessUnitsRepository.findById(
      request.businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    const invoices = await this.invoicesRepository.findByBusinessUnitId(
      request.businessUnitId,
    );

    return {
      sales: invoices.map((invoice: InvoiceData) => ({
        id: invoice.id,
        number: invoice.number,
        series: invoice.series,
        type: invoice.type,
        companyDocumentCode: invoice.companyDocumentCode,
        issueDate: invoice.issueDate,
        taxableAmount: invoice.taxableAmount,
        vatAmount: invoice.vatAmount,
        totalAmount: invoice.totalAmount,
        status: invoice.status,
        pendingReason: invoice.pendingReason,
        cancelReason: invoice.cancelReason,
        companyId: invoice.companyId,
        businessUnitId: invoice.businessUnitId,
        customerId: invoice.customerId,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      })),
    };
  }
}
