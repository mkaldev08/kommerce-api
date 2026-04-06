import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeStartGamingSessionUseCase } from '@/use-cases/factory/make-start-gaming-session-use-case'
import { handleControllerError } from './helpers/handle-controller-error'
import {
  gamingBusinessUnitParamsSchema,
  startGamingSessionBodySchema,
} from './schemas/gaming-house-schemas'

export async function StartGamingSessionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = gamingBusinessUnitParamsSchema.parse(
      request.params,
    )
    const body = startGamingSessionBodySchema.parse(request.body)

    const useCase = makeStartGamingSessionUseCase()
    const result = await useCase.execute({
      businessUnitId,
      customerId: body.customerId,
      consoleId: body.consoleId,
      gameId: body.gameId,
      startTime: body.startTime,
      notes: body.notes || null,
    })

    return reply.status(201).send(result)
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }

    throw error
  }
}
