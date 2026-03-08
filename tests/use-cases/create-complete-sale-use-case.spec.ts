import { beforeEach, describe, expect, it } from "vitest";
import {
  CashMovementType,
  InvoiceType,
  PaymentMethod,
  SaleStatus,
  VATStatus,
} from "generated/prisma/enums";
import type {
  CreateCashMovementInput,
  CashMovementData,
  CashMovementsRepository,
} from "@/repositories/cash-movements-repository";
import type {
  CreateInvoiceItemInput,
  InvoiceItemsRepository,
  InvoiceItemData,
} from "@/repositories/invoice-items-repository";
import type {
  CreateInvoiceInput,
  InvoiceData,
  InvoicesRepository,
} from "@/repositories/invoices-repository";
import type {
  CreatePaymentInput,
  PaymentData,
  PaymentsRepository,
} from "@/repositories/payments-repository";
import { CreateSaleUseCase } from "@/use-cases/create-complete-sale-use-case";

class InMemoryInvoicesRepository implements InvoicesRepository {
  public createdInvoices: CreateInvoiceInput[] = [];
  private invoices: InvoiceData[] = [];

  async create(data: CreateInvoiceInput): Promise<InvoiceData> {
    this.createdInvoices.push(data);

    const now = new Date();
    const invoice: InvoiceData = {
      id: crypto.randomUUID(),
      number: data.number,
      series: data.series,
      type: data.type as InvoiceType,
      issueDate: data.issueDate ?? now,
      taxableAmount: data.taxableAmount,
      vatAmount: data.vatAmount,
      totalAmount: data.totalAmount,
      status: data.status ?? SaleStatus.COMPLETED,
      companyId: data.companyId,
      businessUnitId: data.businessUnitId,
      cashRegisterId: data.cashRegisterId,
      customerId: data.customerId ?? null,
      createdAt: now,
      updatedAt: now,
      pendingReason: null,
      cancelReason: null,
    };

    this.invoices.push(invoice);

    return invoice;
  }

  async findById(id: string): Promise<InvoiceData | null> {
    return this.invoices.find((invoice) => invoice.id === id) ?? null;
  }

  async findByBusinessUnitId(businessUnitId: string): Promise<InvoiceData[]> {
    return this.invoices.filter(
      (invoice) => invoice.businessUnitId === businessUnitId,
    );
  }

  async updateTotals(
    _id: string,
    _taxableAmount: number,
    _vatAmount: number,
    _totalAmount: number,
  ): Promise<void> {
    return;
  }

  async updateStatus(
    _id: string,
    _status: SaleStatus,
    _reason?: string,
  ): Promise<void> {
    return;
  }
}

class InMemoryInvoiceItemsRepository implements InvoiceItemsRepository {
  public createdItems: CreateInvoiceItemInput[] = [];

  async createMany(items: CreateInvoiceItemInput[]): Promise<void> {
    this.createdItems.push(...items);
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItemData[]> {
    return this.createdItems
      .filter((item) => item.invoiceId === invoiceId)
      .map((item) => ({
        id: crypto.randomUUID(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate,
        vatAmount: item.vatAmount,
        subtotal: item.subtotal,
        vatStatus: item.vatStatus,
        invoiceId: item.invoiceId,
        productId: item.productId,
      }));
  }
}

class InMemoryPaymentsRepository implements PaymentsRepository {
  public createdPayments: CreatePaymentInput[] = [];

  async create(data: CreatePaymentInput): Promise<PaymentData> {
    this.createdPayments.push(data);

    return {
      id: crypto.randomUUID(),
      amount: data.amount,
      method: data.method,
      paymentDate: data.paymentDate ?? new Date(),
      invoiceId: data.invoiceId,
      paymentType: data.paymentType,
    };
  }

  async listByInvoiceId(invoiceId: string): Promise<PaymentData[]> {
    return this.createdPayments
      .filter((payment) => payment.invoiceId === invoiceId)
      .map((payment) => ({
        id: crypto.randomUUID(),
        amount: payment.amount,
        method: payment.method,
        paymentDate: payment.paymentDate ?? new Date(),
        invoiceId: payment.invoiceId,
        paymentType: payment.paymentType,
      }));
  }

  async getTotalPaidForInvoice(invoiceId: string): Promise<number> {
    return this.createdPayments
      .filter((payment) => payment.invoiceId === invoiceId)
      .reduce((total, payment) => total + payment.amount, 0);
  }

  async getCashTotalForRegisterBetween(
    _cashRegisterId: string,
    _from: Date,
    _to: Date,
  ): Promise<number> {
    return 0;
  }
}

class InMemoryCashMovementsRepository implements CashMovementsRepository {
  public createdMovements: CreateCashMovementInput[] = [];

  async create(data: CreateCashMovementInput): Promise<CashMovementData> {
    this.createdMovements.push(data);

    return {
      id: crypto.randomUUID(),
      type: data.type,
      amount: data.amount,
      description: data.description,
      movementDate: data.movementDate ?? new Date(),
      cashRegisterId: data.cashRegisterId,
    };
  }

  async listByRegisterBetween(
    _cashRegisterId: string,
    _from: Date,
    _to: Date,
  ): Promise<CashMovementData[]> {
    return this.createdMovements.map((movement) => ({
      id: crypto.randomUUID(),
      type: movement.type,
      amount: movement.amount,
      description: movement.description,
      movementDate: movement.movementDate ?? new Date(),
      cashRegisterId: movement.cashRegisterId,
    }));
  }
}

describe("CreateSaleUseCase", () => {
  let invoicesRepository: InMemoryInvoicesRepository;
  let invoiceItemsRepository: InMemoryInvoiceItemsRepository;
  let paymentsRepository: InMemoryPaymentsRepository;
  let cashMovementsRepository: InMemoryCashMovementsRepository;
  let sut: CreateSaleUseCase;

  beforeEach(() => {
    invoicesRepository = new InMemoryInvoicesRepository();
    invoiceItemsRepository = new InMemoryInvoiceItemsRepository();
    paymentsRepository = new InMemoryPaymentsRepository();
    cashMovementsRepository = new InMemoryCashMovementsRepository();

    sut = new CreateSaleUseCase(
      invoicesRepository,
      invoiceItemsRepository,
      paymentsRepository,
      cashMovementsRepository,
    );
  });

  it("should create a cash ENTRY movement automatically for cash sales", async () => {
    const result = await sut.execute({
      businessUnitId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      items: [
        {
          productServiceId: crypto.randomUUID(),
          quantity: 2,
          unitPrice: 100,
          vatRate: 14,
        },
      ],
      totalAmount: 200,
      paymentMethod: PaymentMethod.CASH,
      companyId: crypto.randomUUID(),
      cashRegisterId: crypto.randomUUID(),
      status: SaleStatus.COMPLETED,
    });

    expect(result.sale.id).toEqual(expect.any(String));
    expect(paymentsRepository.createdPayments).toHaveLength(1);
    expect(cashMovementsRepository.createdMovements).toHaveLength(1);
    expect(cashMovementsRepository.createdMovements[0]).toEqual(
      expect.objectContaining({
        type: CashMovementType.ENTRY,
        amount: 200,
      }),
    );
  });

  it("should not create automatic movement for non-cash sales", async () => {
    await sut.execute({
      businessUnitId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      items: [
        {
          productServiceId: crypto.randomUUID(),
          quantity: 1,
          unitPrice: 150,
          vatRate: 14,
        },
      ],
      totalAmount: 150,
      paymentMethod: PaymentMethod.CARD,
      companyId: crypto.randomUUID(),
      cashRegisterId: crypto.randomUUID(),
      status: SaleStatus.COMPLETED,
    });

    expect(paymentsRepository.createdPayments).toHaveLength(1);
    expect(cashMovementsRepository.createdMovements).toHaveLength(0);
  });

  it("should create invoice items with VAT breakdown", async () => {
    await sut.execute({
      businessUnitId: crypto.randomUUID(),
      customerId: crypto.randomUUID(),
      items: [
        {
          productServiceId: crypto.randomUUID(),
          quantity: 2,
          unitPrice: 100,
          vatRate: 14,
        },
        {
          productServiceId: crypto.randomUUID(),
          quantity: 1,
          unitPrice: 50,
          vatRate: 0,
        },
      ],
      totalAmount: 250,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      companyId: crypto.randomUUID(),
      cashRegisterId: crypto.randomUUID(),
      status: SaleStatus.COMPLETED,
    });

    expect(invoiceItemsRepository.createdItems).toHaveLength(2);
    expect(invoiceItemsRepository.createdItems[0]).toEqual(
      expect.objectContaining({
        subtotal: 200,
        vatStatus: VATStatus.TAXED,
      }),
    );
    expect(invoiceItemsRepository.createdItems[0].vatAmount).toBeCloseTo(28, 6);
    expect(invoiceItemsRepository.createdItems[1]).toEqual(
      expect.objectContaining({
        subtotal: 50,
        vatAmount: 0,
        vatStatus: VATStatus.EXEMPT,
      }),
    );
  });
});
