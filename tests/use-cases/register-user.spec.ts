import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/register-user-use-case'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('Should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
      phoneNumber: '933808187',
      username: 'johndoe',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
      phoneNumber: '933808187',
      username: 'johndoe',
    })

    const isCorrectlyPasswordHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isCorrectlyPasswordHashed).toBe(true)
  })

  it('should not be able to register with the same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
      phoneNumber: '933808187',
      username: 'johndoe',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'Johndoe@example.com',
        password: '123456',
        phoneNumber: '933808187',
        username: 'johndoe',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register with the same username twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
      phoneNumber: '933808187',
      username: 'johndoe',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'Johndoe@example.com',
        password: '123456',
        phoneNumber: '933808187',
        username: 'johndoe',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
