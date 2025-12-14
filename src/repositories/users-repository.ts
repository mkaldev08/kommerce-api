import type { Prisma, User } from 'generated/prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  findByPhoneNumber(phoneNumber: string): Promise<User | null>
}
