import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { MakeGetAllProvincesUseCase } from '@/use-cases/factory/make-get-all-provinces-use-case'

export async function GetAllProvinces(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getAllProvincesUseCase = MakeGetAllProvincesUseCase()

    const { provinces } = await getAllProvincesUseCase.execute()

    return reply.status(200).send({ provinces })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data' })
    }

    throw err
  }
}
