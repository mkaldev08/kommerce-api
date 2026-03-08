import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ListInvoicesUseCase } from "@/use-cases/list-invoices-use-case";
import { PrismaInvoicesRepository } from "@/repositories/prisma/prisma-invoices-repository";
import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { PrismaPaymentsRepository } from "@/repositories/prisma/prisma-payments-repository";
import { handleControllerError } from "@/http/controllers/handle-controller-error";

const listSalesQuerySchema = z.object({
  businessUnitId: z.string().uuid(),
});

export async function listSalesController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { businessUnitId } = listSalesQuerySchema.parse(request.query);

  try {
    const invoicesRepository = new PrismaInvoicesRepository();
    const businessUnitsRepository = new PrismaBusinessUnitRepository();
    const paymentsRepository = new PrismaPaymentsRepository();

    const listInvoicesUseCase = new ListInvoicesUseCase(
      invoicesRepository,
      businessUnitsRepository,
    );

    const result = await listInvoicesUseCase.execute({
      businessUnitId,
    });

    const sales = await Promise.all(
      result.sales.map(async (invoice) => {
        const payments = await paymentsRepository.listByInvoiceId(invoice.id);
        const latestPayment = payments.sort(
          (left, right) =>
            right.paymentDate.getTime() - left.paymentDate.getTime(),
        )[0];

        return {
          id: invoice.id,
          businessUnitId: invoice.businessUnitId,
          customerId: invoice.customerId,
          totalAmount: invoice.totalAmount,
          paymentMethod: latestPayment?.method,
          status: invoice.status,
          pendingReason: invoice.pendingReason,
          cancelReason: invoice.cancelReason,
          date: invoice.issueDate.toISOString(),
          createdAt: invoice.createdAt.toISOString(),
          updatedAt: invoice.updatedAt.toISOString(),
        };
      }),
    );

    reply.send({ sales });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
