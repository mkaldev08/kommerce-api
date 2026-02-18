import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MakeGetMunicipalitiesByProvinceIdUseCase } from '@/use-cases/factory/make-get-municipalities-by-province-id-use-case'

export async function GetMunicipalitiesByProvinceId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMunicipalitiesByProvinceIdParamsSchema = z.object({
    provinceId: z.string().uuid(),
  })

  const { provinceId } = getMunicipalitiesByProvinceIdParamsSchema.parse(
    request.params,
  )

  try {
    const getMunicipalitiesByProvinceIdUseCase =
      MakeGetMunicipalitiesByProvinceIdUseCase()

    const { municipalities } =
      await getMunicipalitiesByProvinceIdUseCase.execute({
        provinceId,
      })

    return reply.status(200).send({ municipalities })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data' })
    } else if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
