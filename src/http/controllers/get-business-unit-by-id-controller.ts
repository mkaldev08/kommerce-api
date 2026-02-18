import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MakeGetBusinessUnitByIdUseCase } from '@/use-cases/factory/make-get-business-unit-by-id-use-case'

export async function GetBusinessUnitByIdController(
  request: FastifyRequest<{
    Params: {
      businessUnitId: string
    }
  }>,
  reply: FastifyReply,
) {
  const getBusinessUnitByIdParamsSchema = z.object({
    businessUnitId: z.string().uuid(),
  })

  const { businessUnitId } = getBusinessUnitByIdParamsSchema.parse(
    request.params,
  )

  try {
    const getBusinessUnitByIdUseCase = MakeGetBusinessUnitByIdUseCase()

    const { businessUnit } = await getBusinessUnitByIdUseCase.execute({
      businessUnitId,
    })

    return reply.status(200).send({ businessUnit })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data' })
    } else if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
