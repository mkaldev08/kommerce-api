import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MakeFindCompanyByIdUseCase } from '@/use-cases/factory/make-find-company-by-id-use-case'

export async function FindCompanyById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findCompanyByIdParamsSchema = z.object({
    companyId: z.string().uuid(),
  })

  const { companyId } = findCompanyByIdParamsSchema.parse(request.params)

  try {
    const findCompanyByIdUseCase = MakeFindCompanyByIdUseCase()

    const { company } = await findCompanyByIdUseCase.execute({
      companyId,
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
