import { prisma } from "@/lib/prisma";
import type {
  InvoiceReportData,
  InvoiceReportRepository,
} from "../invoice-report-repository";

export class PrismaInvoiceReportRepository implements InvoiceReportRepository {
  async findByInvoiceId(invoiceId: string): Promise<InvoiceReportData | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        company: true,
        business_unit: true,
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: {
          orderBy: {
            payment_date: "desc",
          },
        },
      },
    });

    if (!invoice) {
      return null;
    }

    return {
      id: invoice.id,
      number: invoice.number,
      series: invoice.series,
      type: invoice.type,
      issueDate: invoice.issue_date,
      taxableAmount: Number(invoice.taxable_amount),
      vatAmount: Number(invoice.vat_amount),
      totalAmount: Number(invoice.total_amount),
      status: invoice.status,
      pendingReason: invoice.pending_reason,
      cancelReason: invoice.cancel_reason,
      paymentMethod: invoice.payments[0]?.method,
      company: {
        legalName: invoice.company.legal_name,
        tradeName: invoice.company.trade_name,
        nif: invoice.company.nif ?? null,
        documentCodePrefix: invoice.company.document_code_prefix ?? null,
        imageData: invoice.company.image_data,
        imageType: invoice.company.image_type,
        email: invoice.company.email,
        phoneNumber: invoice.company.phone_number,
        streetAddress: invoice.company.street_address,
        postalCode: invoice.company.postal_code,
      },
      businessUnit: {
        name: invoice.business_unit.name,
        address: invoice.business_unit.address,
      },
      customer: invoice.customer
        ? {
            name: invoice.customer.name,
            email: invoice.customer.email,
            phoneNumber: invoice.customer.phone_number,
            nif: invoice.customer.nif,
            streetAddress: invoice.customer.street_address,
            postalCode: invoice.customer.postal_code,
          }
        : undefined,
      items: invoice.items.map((item) => ({
        productCode: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        vatRate: Number(item.vat_rate),
        vatAmount: Number(item.vat_amount),
        subtotal: Number(item.subtotal),
      })),
    };
  }
}
