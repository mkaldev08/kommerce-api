import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { MakeAuthenticateUseCase } from '@/use-cases/factory/make-authenticate-use-case'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    password: z.string(),
    username: z.string().trim().min(5),
  })
  const { password, username } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = MakeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      password,
      username,
    })

    const accessToken = await reply.jwtSign(
      {},
      {
        sub: user.id,
        expiresIn: '7d',
      },
    )

    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure: true in production
      sameSite: true,
      path: '/',
    })

    return reply.status(200).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        accessToken,
      },
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }
    throw err
  }
}
