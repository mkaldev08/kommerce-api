import bcrypt from 'bcryptjs'
import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseParams {
  username: string
  phoneNumber: string
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
    phoneNumber,
    username,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
    const hasSavedThisEmail = await this.usersRepository.findByEmail(email)

    if (hasSavedThisEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHashed = await bcrypt.hash(password, 6)

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHashed,
      phone_number: phoneNumber,
      username,
    })

    return {
      user,
    }
  }
}
