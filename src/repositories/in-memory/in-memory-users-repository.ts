import { uuidv7 } from 'uuidv7'
import type { Prisma, User } from '@/generated/prisma/client'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  async findById(userId: string) {
    const user = this.items.find((item) => item.id === userId)

    if (!user) return null

    return user
  }
  private items: User[] = []
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: data.id ?? uuidv7(),
      username: data.username,
      name: data.name,
      email: data.username,
      phone_number: data.phone_number,
      password_hash: data.password_hash,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(user)

    return user
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)

    if (!user) return null
    return user
  }
}
