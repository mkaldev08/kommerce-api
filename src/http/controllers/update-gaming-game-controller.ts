import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeUpdateGamingGameUseCase } from '@/use-cases/factory/make-update-gaming-game-use-case'
import { handleControllerError } from './helpers/handle-controller-error'
import {
  gamingEntityIdParamsSchema,
  updateGamingGameBodySchema,
} from './schemas/gaming-house-schemas'

export async function UpdateGamingGameController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = gamingEntityIdParamsSchema.parse(request.params)
    const body = updateGamingGameBodySchema.parse(request.body)

    const useCase = makeUpdateGamingGameUseCase()
    const result = await useCase.execute({
      id,
      data: {
        name: body.name,
        genre: body.genre || undefined,
        hourlyRate: body.hourlyRate,
        isActive: body.isActive,
      },
    })

    return reply.status(200).send(result)
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }

    throw error
  }
}
