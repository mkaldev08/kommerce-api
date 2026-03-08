import type { InvoicesRepository } from "../repositories/invoices-repository";
import type { InvoiceItemsRepository } from "../repositories/invoice-items-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetSaleRequest {
  invoiceId: string;
}

interface SaleItemData {
  productServiceId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface GetSaleResponse {
  id: string;
  businessUnitId: string;
  customerId?: string | null;
  totalAmount: number;
  status: string;
  pendingReason?: string | null;
  cancelReason?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  items: SaleItemData[];
}

export class GetSaleUseCase {
  constructor(
    private invoicesRepository: InvoicesRepository,
    private invoiceItemsRepository: InvoiceItemsRepository,
  ) {}

  async execute(request: GetSaleRequest): Promise<GetSaleResponse> {
    const invoice = await this.invoicesRepository.findById(request.invoiceId);

    if (!invoice) {
      throw new ResourceNotFoundError();
    }

    const items = await this.invoiceItemsRepository.findByInvoiceId(
      request.invoiceId,
    );

    return {
      id: invoice.id,
      businessUnitId: invoice.businessUnitId,
      customerId: invoice.customerId,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      pendingReason: invoice.pendingReason,
      cancelReason: invoice.cancelReason,
      date: invoice.issueDate,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      items: items.map((item: any) => ({
        productServiceId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    };
  }
}
