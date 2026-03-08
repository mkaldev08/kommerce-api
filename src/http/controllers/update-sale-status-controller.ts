import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { SaleStatus } from "generated/prisma/enums";
import { UpdateInvoiceStatusUseCase } from "@/use-cases/update-invoice-status-use-case";
import { PrismaInvoicesRepository } from "@/repositories/prisma/prisma-invoices-repository";
import { PrismaPaymentsRepository } from "@/repositories/prisma/prisma-payments-repository";
import { handleControllerError } from "@/http/controllers/handle-controller-error";

const updateSaleStatusParamsSchema = z.object({
  id: z.string().uuid(),
});

const updateSaleStatusBodySchema = z.object({
  status: z.nativeEnum(SaleStatus),
  reason: z.string().trim().min(1).optional(),
});

export async function updateSaleStatusController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = updateSaleStatusParamsSchema.parse(request.params);
  const body = updateSaleStatusBodySchema.parse(request.body);

  try {
    const invoicesRepository = new PrismaInvoicesRepository();
    const paymentsRepository = new PrismaPaymentsRepository();

    const updateStatus = new UpdateInvoiceStatusUseCase(invoicesRepository);

    await updateStatus.execute({
      invoiceId: id,
      status: body.status,
      reason: body.reason,
    });

    // Return the updated sale
    const invoice = await invoicesRepository.findById(id);

    if (!invoice) {
      reply.status(404).send({ message: "Venda não encontrada" });
      return;
    }

    const payments = await paymentsRepository.listByInvoiceId(id);
    const latestPayment = payments.sort(
      (left, right) => right.paymentDate.getTime() - left.paymentDate.getTime(),
    )[0];

    reply.send({
      sale: {
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
      },
    });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
