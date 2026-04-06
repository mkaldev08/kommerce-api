import bcrypt from 'bcryptjs'
import type { User } from 'generated/prisma/client'
import { UserRole } from 'generated/prisma/enums'
import type { UsersRepository } from '@/repositories/users-repository'
import { InvalidUserRoleAssignmentError } from './errors/invalid-user-role-assignment-error'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseParams {
  username: string
  phoneNumber: string
  full_name: string
  email: string
  password: string
  role?: UserRole
  businessUnitId?: string | null
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    businessUnitId,
    email,
    full_name,
    password,
    phoneNumber,
    role,
    username,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
    const [emailExists, usernameExists, phoneNumberExists] = await Promise.all([
      this.usersRepository.findByEmail(email),
      this.usersRepository.findByUsername(username),
      this.usersRepository.findByPhoneNumber(phoneNumber),
    ])

    if (emailExists || usernameExists || phoneNumberExists) {
      throw new UserAlreadyExistsError()
    }

    const resolvedRole = role ?? UserRole.ADMIN

    if (
      (resolvedRole === UserRole.MANAGER ||
        resolvedRole === UserRole.OPERATOR) &&
      !businessUnitId
    ) {
      throw new InvalidUserRoleAssignmentError()
    }

    if (resolvedRole === UserRole.ADMIN && businessUnitId) {
      throw new InvalidUserRoleAssignmentError(
        'Admin cannot be restricted to a business unit.',
      )
    }

    const passwordHashed = await bcrypt.hash(password, 6)

    const user = await this.usersRepository.create({
      business_unit_id: businessUnitId ?? null,
      email,
      full_name,
      password_hash: passwordHashed,
      phone_number: phoneNumber,
      role: resolvedRole,
      username,
    })

    return {
      user,
    }
  }
}
