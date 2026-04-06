import bcrypt from 'bcryptjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { handleControllerError } from '@/http/controllers/handle-controller-error'
import { prisma } from '@/lib/prisma'
import { strongPasswordRegex } from '@/utils/regex-formats'

const updateCurrentUserPasswordBodySchema = z.object({
  current_password: z
    .string()
    .trim()
    .min(1, 'A palavra-passe atual é obrigatória.'),
  new_password: z.string().min(6).regex(strongPasswordRegex, {
    error:
      'A nova palavra-passe deve ter pelo menos 6 caracteres e incluir uma letra maiúscula, uma minúscula e um número.',
  }),
})

export async function updateCurrentUserPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = request.authUser

  if (!currentUser) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  try {
    const body = updateCurrentUserPasswordBodySchema.parse(request.body)

    if (body.current_password === body.new_password) {
      return reply.status(400).send({
        message: 'A nova palavra-passe deve ser diferente da atual.',
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { id: true, password_hash: true },
    })

    if (!user) {
      return reply.status(404).send({ message: 'Recurso não encontrado' })
    }

    const doesPasswordMatch = await bcrypt.compare(
      body.current_password,
      user.password_hash,
    )

    if (!doesPasswordMatch) {
      return reply
        .status(401)
        .send({ message: 'Palavra-passe atual inválida.' })
    }

    const passwordHashed = await bcrypt.hash(body.new_password, 6)

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password_hash: passwordHashed },
    })

    return reply.status(204).send()
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }

    throw error
  }
}
