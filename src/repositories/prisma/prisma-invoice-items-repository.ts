import { VATStatus } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
  CreateInvoiceItemInput,
  InvoiceItemData,
  InvoiceItemsRepository,
} from "../invoice-items-repository";

export class PrismaInvoiceItemsRepository implements InvoiceItemsRepository {
  async createMany(items: CreateInvoiceItemInput[]): Promise<void> {
    if (items.length === 0) return;

    await prisma.invoiceItem.createMany({
      data: items.map((item) => ({
        invoice_id: item.invoiceId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        vat_rate: item.vatRate,
        vat_amount: item.vatAmount,
        subtotal: item.subtotal,
        vat_status: item.vatStatus as keyof typeof VATStatus,
      })),
    });
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItemData[]> {
    const items = await prisma.invoiceItem.findMany({
      where: { invoice_id: invoiceId },
    });

    return items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      vatRate: Number(item.vat_rate),
      vatAmount: Number(item.vat_amount),
      subtotal: Number(item.subtotal),
      vatStatus: item.vat_status,
      invoiceId: item.invoice_id,
      productId: item.product_id,
    }));
  }
}
