import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MakeFindOneCompanyByOwnerIdUseCase } from '@/use-cases/factory/make-find-one-company-by-owner-id-use-case'

export async function FindOneCompanyByOwnerId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findOneCompanyByOwnerIdParamsSchema = z.object({
    ownerId: z.string().uuid(),
  })

  const { ownerId } = findOneCompanyByOwnerIdParamsSchema.parse(request.params)

  try {
    const findOneCompanyByOwnerIdUseCase = MakeFindOneCompanyByOwnerIdUseCase()

    const { company } = await findOneCompanyByOwnerIdUseCase.execute({
      ownerId,
    })

    return reply.status(200).send({ company })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data' })
    } else if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
