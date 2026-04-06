import type { FastifyRequest, FastifyReply } from 'fastify'
import { PaymentMethod, SaleStatus, UserRole } from 'generated/prisma/enums'
import { z } from 'zod'
import { handleControllerError } from '@/http/controllers/handle-controller-error'
import { PrismaCashMovementsRepository } from '@/repositories/prisma/prisma-cash-movements-repository'
import { PrismaInvoiceItemsRepository } from '@/repositories/prisma/prisma-invoice-items-repository'
import { PrismaInvoicesRepository } from '@/repositories/prisma/prisma-invoices-repository'
import { PrismaPaymentsRepository } from '@/repositories/prisma/prisma-payments-repository'
import { CreateSaleUseCase } from '@/use-cases/create-complete-sale-use-case'

const createSaleBodySchema = z.object({
  businessUnitId: z.string().uuid(),
  customerId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productServiceId: z.string().uuid(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
        vatRate: z.number().min(0).optional(),
        subtotal: z.number().positive().optional(),
      }),
    )
    .min(1),
  totalAmount: z.number().positive(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(SaleStatus).optional(),
  date: z.coerce.date().optional(),
  notes: z.string().trim().min(1).optional(),
  companyId: z.string().uuid(),
  cashRegisterId: z.string().uuid(),
})

export async function createSaleController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const body = createSaleBodySchema.parse(request.body)
    const authUser = request.authUser

    if (
      authUser?.role === UserRole.OPERATOR &&
      body.status &&
      body.status !== SaleStatus.COMPLETED
    ) {
      reply.status(403).send({ message: 'Forbidden.' })
      return
    }

    const invoicesRepository = new PrismaInvoicesRepository()
    const invoiceItemsRepository = new PrismaInvoiceItemsRepository()
    const paymentsRepository = new PrismaPaymentsRepository()
    const cashMovementsRepository = new PrismaCashMovementsRepository()

    const createSaleUseCase = new CreateSaleUseCase(
      invoicesRepository,
      invoiceItemsRepository,
      paymentsRepository,
      cashMovementsRepository,
    )

    const result = await createSaleUseCase.execute({
      businessUnitId: body.businessUnitId,
      customerId: body.customerId,
      items: body.items,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod,
      status: body.status,
      date: body.date,
      notes: body.notes,
      companyId: body.companyId,
      cashRegisterId: body.cashRegisterId,
    })

    reply.status(201).send({
      sale: result.sale,
    })
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }

    throw error
  }
}
