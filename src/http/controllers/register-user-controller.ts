import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from 'generated/prisma/enums'
import z from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { MakeRegisterUserUseCase } from '@/use-cases/factory/make-register-user-use-case'
import { strongPasswordRegex } from '@/utils/regex-formats'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    email: z.email().trim(),
    password: z.string().min(6).regex(strongPasswordRegex, {
      error:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
    }),
    full_name: z.string(),
    phoneNumber: z.string().trim().min(9),
    username: z.string().trim().min(5),
  })
  const { email, password, full_name, phoneNumber, username } =
    registerBodySchema.parse(request.body)

  try {
    const registerUseCase = MakeRegisterUserUseCase()

    await registerUseCase.execute({
      businessUnitId: null,
      email,
      full_name,
      password,
      phoneNumber,
      role: UserRole.ADMIN,
      username,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      reply.status(409).send({ message: err.message })
    }
    throw err
  }

  reply.status(201).send()
}
