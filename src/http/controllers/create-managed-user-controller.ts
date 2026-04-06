import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from 'generated/prisma/enums'
import z from 'zod'
import { handleControllerError } from '@/http/controllers/handle-controller-error'
import { InvalidUserRoleAssignmentError } from '@/use-cases/errors/invalid-user-role-assignment-error'
import { MakeRegisterUserUseCase } from '@/use-cases/factory/make-register-user-use-case'
import { strongPasswordRegex } from '@/utils/regex-formats'

const createManagedUserBodySchema = z.object({
  email: z.email().trim(),
  password: z.string().min(6).regex(strongPasswordRegex, {
    error:
      'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
  }),
  full_name: z.string(),
  phoneNumber: z.string().trim().min(9),
  username: z.string().trim().min(5),
  role: z.enum([UserRole.MANAGER, UserRole.OPERATOR]),
  businessUnitId: z.string().uuid(),
})

export async function createManagedUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const currentUser = request.authUser

  if (!currentUser) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  const body = createManagedUserBodySchema.parse(request.body)

  try {
    if (currentUser.role === UserRole.OPERATOR) {
      return reply.status(403).send({ message: 'Forbidden.' })
    }

    if (currentUser.role === UserRole.MANAGER) {
      if (body.role !== UserRole.OPERATOR) {
        throw new InvalidUserRoleAssignmentError(
          'Manager can only create operator accounts.',
        )
      }

      if (
        !currentUser.businessUnitId ||
        body.businessUnitId !== currentUser.businessUnitId
      ) {
        throw new InvalidUserRoleAssignmentError(
          'Manager can only create operators in the same business unit.',
        )
      }
    }

    const registerUseCase = MakeRegisterUserUseCase()

    const { user } = await registerUseCase.execute({
      businessUnitId: body.businessUnitId,
      email: body.email,
      full_name: body.full_name,
      password: body.password,
      phoneNumber: body.phoneNumber,
      role: body.role,
      username: body.username,
    })

    return reply.status(201).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        businessUnitId: user.business_unit_id,
      },
    })
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }

    throw error
  }
}
