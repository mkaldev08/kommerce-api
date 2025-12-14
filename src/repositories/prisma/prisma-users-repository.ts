import type { Prisma } from 'generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByPhoneNumber(phoneNumber: string) {
    return await prisma.user.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    })
  }
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    })
  }
  async findById(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }
}
