import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    let isAuthenticated = false

    try {
      await request.jwtVerify({ onlyCookie: true })
      isAuthenticated = true
    } catch {
      const authorization = request.headers.authorization

      if (authorization?.startsWith('Bearer ')) {
        const token = authorization.slice('Bearer '.length).trim()

        if (token) {
          const payload = request.server.jwt.verify<{
            sub?: string
            role?: string
            iat?: number
            exp?: number
          }>(token)

          request.user = payload as typeof request.user
          isAuthenticated = true
        }
      }
    }

    if (!isAuthenticated) {
      reply.status(401).send({ message: 'Unauthorized.' })
      return
    }

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
