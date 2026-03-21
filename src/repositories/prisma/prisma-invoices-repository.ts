import { InvoiceType, SaleStatus } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
  CreateInvoiceInput,
  InvoiceData,
  InvoicesRepository,
} from "../invoices-repository";

export class PrismaInvoicesRepository implements InvoicesRepository {
  async create(data: CreateInvoiceInput): Promise<InvoiceData> {
    const invoice = await prisma.invoice.create({
      data: {
        number: data.number,
        series: data.series,
        type: data.type as keyof typeof InvoiceType,
        issue_date: data.issueDate || new Date(),
        taxable_amount: data.taxableAmount,
        vat_amount: data.vatAmount,
        total_amount: data.totalAmount,
        status: (data.status || "COMPLETED") as keyof typeof SaleStatus,
        company_id: data.companyId,
        business_unit_id: data.businessUnitId,
        cash_register_id: data.cashRegisterId,
        customer_id: data.customerId || null,
      },
    });

    return {
      id: invoice.id,
      number: invoice.number,
      series: invoice.series,
      type: invoice.type,
      companyDocumentCode: undefined,
      issueDate: invoice.issue_date,
      taxableAmount: Number(invoice.taxable_amount),
      vatAmount: Number(invoice.vat_amount),
      totalAmount: Number(invoice.total_amount),
      status: invoice.status,
      pendingReason: invoice.pending_reason,
      cancelReason: invoice.cancel_reason,
      companyId: invoice.company_id,
      businessUnitId: invoice.business_unit_id,
      cashRegisterId: invoice.cash_register_id,
      customerId: invoice.customer_id,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
    };
  }

  async findById(id: string): Promise<InvoiceData | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!invoice) return null;

    return {
      id: invoice.id,
      number: invoice.number,
      series: invoice.series,
      type: invoice.type,
      companyDocumentCode: invoice.company.document_code,
      issueDate: invoice.issue_date,
      taxableAmount: Number(invoice.taxable_amount),
      vatAmount: Number(invoice.vat_amount),
      totalAmount: Number(invoice.total_amount),
      status: invoice.status,
      pendingReason: invoice.pending_reason,
      cancelReason: invoice.cancel_reason,
      companyId: invoice.company_id,
      businessUnitId: invoice.business_unit_id,
      cashRegisterId: invoice.cash_register_id,
      customerId: invoice.customer_id,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
    };
  }

  async findByBusinessUnitId(businessUnitId: string): Promise<InvoiceData[]> {
    const invoices = await prisma.invoice.findMany({
      where: { business_unit_id: businessUnitId },
      orderBy: { issue_date: "desc" },
      include: {
        company: true,
      },
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      series: invoice.series,
      type: invoice.type,
      companyDocumentCode: invoice.company.document_code,
      issueDate: invoice.issue_date,
      taxableAmount: Number(invoice.taxable_amount),
      vatAmount: Number(invoice.vat_amount),
      totalAmount: Number(invoice.total_amount),
      status: invoice.status,
      pendingReason: invoice.pending_reason,
      cancelReason: invoice.cancel_reason,
      companyId: invoice.company_id,
      businessUnitId: invoice.business_unit_id,
      cashRegisterId: invoice.cash_register_id,
      customerId: invoice.customer_id,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
    }));
  }

  async updateTotals(
    id: string,
    taxableAmount: number,
    vatAmount: number,
    totalAmount: number,
  ): Promise<void> {
    await prisma.invoice.update({
      where: { id },
      data: {
        taxable_amount: taxableAmount,
        vat_amount: vatAmount,
        total_amount: totalAmount,
      },
    });
  }

  async updateStatus(
    id: string,
    status: string,
    reason?: string,
  ): Promise<void> {
    const data: any = {
      status: status as keyof typeof SaleStatus,
    };

    if (status === SaleStatus.PENDING && reason) {
      data.pending_reason = reason;
    } else if (status === SaleStatus.CANCELLED && reason) {
      data.cancel_reason = reason;
    }

    await prisma.invoice.update({
      where: { id },
      data,
    });
  }
}
