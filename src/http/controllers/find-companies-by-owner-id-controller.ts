import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MakeFindCompaniesByOwnerIdUseCase } from '@/use-cases/factory/make-find-companies-by-owner-id-use-case'

export async function FindCompaniesByOwnerId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findCompaniesByOwnerIdParamsSchema = z.object({
    ownerId: z.uuid(),
  })

  const { ownerId } = findCompaniesByOwnerIdParamsSchema.parse(request.params)

  try {
    const findCompaniesByOwnerIdUseCase = MakeFindCompaniesByOwnerIdUseCase()

    const { companies } = await findCompaniesByOwnerIdUseCase.execute({
      ownerId,
    })

    return reply.status(200).send({ companies })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data' })
    } else if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
