import type { FastifyReply, FastifyRequest } from 'fastify'

export async function logoutUser(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  reply.clearCookie('accessToken', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
  })

  return reply.status(204).send()
}
