import { SaleStatus } from "generated/prisma/enums";
import type { InvoicesRepository } from "../repositories/invoices-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateInvoiceStatusRequest {
  invoiceId: string;
  status: SaleStatus;
  reason?: string;
}

interface UpdateInvoiceStatusResponse {
  success: boolean;
}

export class UpdateInvoiceStatusUseCase {
  constructor(private invoicesRepository: InvoicesRepository) {}

  async execute(
    request: UpdateInvoiceStatusRequest,
  ): Promise<UpdateInvoiceStatusResponse> {
    const invoice = await this.invoicesRepository.findById(request.invoiceId);

    if (!invoice) {
      throw new ResourceNotFoundError();
    }

    await this.invoicesRepository.updateStatus(
      request.invoiceId,
      request.status,
      request.reason,
    );

    return { success: true };
  }
}
