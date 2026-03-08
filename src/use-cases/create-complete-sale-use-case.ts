import type { InvoicesRepository } from "../repositories/invoices-repository";
import type { InvoiceItemsRepository } from "../repositories/invoice-items-repository";
import type { PaymentsRepository } from "../repositories/payments-repository";
import type { CashMovementsRepository } from "@/repositories/cash-movements-repository";
import {
  CashMovementType,
  PaymentMethod,
  SaleStatus,
  VATStatus,
} from "generated/prisma/enums";

export interface SaleItemInput {
  productServiceId: string;
  quantity: number;
  unitPrice: number;
  vatRate?: number;
  subtotal?: number;
}

interface CreateSaleRequest {
  businessUnitId: string;
  customerId: string;
  items: SaleItemInput[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status?: SaleStatus;
  date?: Date;
  notes?: string;
  companyId: string;
  cashRegisterId: string;
}

type item = {
  productServiceId: string;
  quantity: number;
  unitPrice: number;
  vatRate?: number;
  subtotal?: number;
};
interface SaleResponse {
  id: string;
  businessUnitId: string;
  customerId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: item[];
}

interface CreateSaleResponse {
  sale: SaleResponse;
}

export class CreateSaleUseCase {
  constructor(
    private invoicesRepository: InvoicesRepository,
    private invoiceItemsRepository: InvoiceItemsRepository,
    private paymentsRepository: PaymentsRepository,
    private cashMovementsRepository: CashMovementsRepository,
  ) {}

  async execute(request: CreateSaleRequest): Promise<CreateSaleResponse> {
    // Calculate totals
    let totalTaxableAmount = 0;
    let totalVatAmount = 0;

    const itemsData = request.items.map((item) => {
      const subtotal = item.subtotal || item.quantity * item.unitPrice;
      const vatRate = item.vatRate || 0;
      const vatAmount = subtotal * (vatRate / 100);
      totalTaxableAmount += subtotal;
      totalVatAmount += vatAmount;

      return {
        invoiceId: "", // Will be set after invoice creation
        productId: item.productServiceId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: vatRate,
        vatAmount: vatAmount,
        subtotal: subtotal,
        vatStatus: vatRate > 0 ? VATStatus.TAXED : VATStatus.EXEMPT,
      };
    });

    // Create invoice
    const invoice = await this.invoicesRepository.create({
      number: this.generateInvoiceNumber(),
      series: new Date().getFullYear().toString(),
      type: "INVOICE",
      issueDate: request.date ? new Date(request.date) : new Date(),
      taxableAmount: totalTaxableAmount,
      vatAmount: totalVatAmount,
      totalAmount: request.totalAmount,
      status: request.status || SaleStatus.COMPLETED,
      companyId: request.companyId,
      businessUnitId: request.businessUnitId,
      cashRegisterId: request.cashRegisterId,
      customerId: request.customerId,
    });

    // Create invoice items
    const items = itemsData.map((item) => ({
      ...item,
      invoiceId: invoice.id,
    }));

    await this.invoiceItemsRepository.createMany(items);

    // Create payment record
    await this.paymentsRepository.create({
      amount: request.totalAmount,
      method: request.paymentMethod,
      paymentDate: request.date ? new Date(request.date) : new Date(),
      invoiceId: invoice.id,
      paymentType: "TUITION_FEE", // Default payment type
    });

    if (request.paymentMethod === PaymentMethod.CASH) {
      await this.cashMovementsRepository.create({
        cashRegisterId: request.cashRegisterId,
        type: CashMovementType.ENTRY,
        amount: request.totalAmount,
        description: `Entrada automática da venda ${invoice.number}/${invoice.series}`,
        movementDate: request.date ? new Date(request.date) : new Date(),
      });
    }

    // Return formatted response
    return {
      sale: {
        id: invoice.id,
        businessUnitId: invoice.businessUnitId,
        customerId: invoice.customerId || "",
        totalAmount: invoice.totalAmount,
        paymentMethod: request.paymentMethod,
        status: invoice.status,
        date: invoice.issueDate,
        notes: request.notes,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: itemsData.map((item) => ({
          productServiceId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      },
    };
  }

  private generateInvoiceNumber(): string {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
  }
}
