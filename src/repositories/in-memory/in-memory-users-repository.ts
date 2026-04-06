import type { Prisma, User } from 'generated/prisma/client'
import { UserRole } from 'generated/prisma/enums'
import { uuidv7 } from 'uuidv7'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = []

  async findByPhoneNumber(phoneNumber: string) {
    const user = this.items.find((user) => user.phone_number === phoneNumber)

    if (!user) return Promise.resolve(null)

    return Promise.resolve(user)
  }
  async findByUsername(username: string) {
    const user = this.items.find((user) => user.username === username)

    if (!user) return null

    return user
  }
  async findById(userId: string) {
    const user = this.items.find((item) => item.id === userId)

    if (!user) return null

    return user
  }
  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user = {
      id: data.id ?? uuidv7(),
      username: data.username,
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      password_hash: data.password_hash,
      is_active: true,
      role: data.role ?? UserRole.ADMIN,
      business_unit_id: data.business_unit_id ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    this.items.push(user)

    return user
  }
  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    if (!user) return null
    return user
  }
}
