import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    const userId = request.user.sub

    if (!userId) {
      reply.status(401).send({ message: 'Unauthorized.' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        is_active: true,
        business_unit_id: true,
        business_unit: {
          select: {
            type: true,
          },
        },
      },
    })

    if (!user || !user.is_active) {
      reply.status(401).send({ message: 'Unauthorized.' })
      return
    }

    request.authUser = {
      id: user.id,
      role: user.role,
      businessUnitId: user.business_unit_id,
      businessUnitType: user.business_unit?.type ?? null,
    }
  } catch {
    reply.status(401).send({ message: 'Unauthorized.' })
  }
}
