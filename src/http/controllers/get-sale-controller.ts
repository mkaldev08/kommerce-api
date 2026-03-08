import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { GetSaleUseCase } from "@/use-cases/get-sale-use-case";
import { PrismaInvoicesRepository } from "@/repositories/prisma/prisma-invoices-repository";
import { PrismaInvoiceItemsRepository } from "@/repositories/prisma/prisma-invoice-items-repository";
import { PrismaPaymentsRepository } from "@/repositories/prisma/prisma-payments-repository";
import { handleControllerError } from "@/http/controllers/handle-controller-error";

const getSaleParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function getSaleController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { id } = getSaleParamsSchema.parse(request.params);

  try {
    const invoicesRepository = new PrismaInvoicesRepository();
    const invoiceItemsRepository = new PrismaInvoiceItemsRepository();
    const paymentsRepository = new PrismaPaymentsRepository();

    const getSaleUseCase = new GetSaleUseCase(
      invoicesRepository,
      invoiceItemsRepository,
    );

    const result = await getSaleUseCase.execute({
      invoiceId: id,
    });

    const payments = await paymentsRepository.listByInvoiceId(id);
    const latestPayment = payments.sort(
      (left, right) => right.paymentDate.getTime() - left.paymentDate.getTime(),
    )[0];

    reply.send({
      sale: {
        ...result,
        paymentMethod: latestPayment?.method,
        pendingReason: result.pendingReason,
        cancelReason: result.cancelReason,
      },
    });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}
