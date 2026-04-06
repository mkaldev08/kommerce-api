import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreateGamingGameUseCase } from '@/use-cases/factory/make-create-gaming-game-use-case'
import { handleControllerError } from './helpers/handle-controller-error'
import {
  createGamingGameBodySchema,
  gamingBusinessUnitParamsSchema,
} from './schemas/gaming-house-schemas'

export async function CreateGamingGameController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(
      request.params,
    )
    const body = createGamingGameBodySchema.parse(request.body)

    const useCase = makeCreateGamingGameUseCase()
    const result = await useCase.execute({
      businessUnitId,
      name: body.name,
      genre: body.genre || null,
      hourlyRate: body.hourlyRate,
      isActive: body.isActive,
    })

    return reply.status(201).send(result)
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }

    throw error
  }
}
