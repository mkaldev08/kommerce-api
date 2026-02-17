import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCompaniesRepository } from '@/repositories/in-memory/in-memory-companies-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { FindOneCompanyByOwnerIdUseCase } from '@/use-cases/find-one-company-by-owner-id-use-case'

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: InMemoryUsersRepository
let sut: FindOneCompanyByOwnerIdUseCase

describe('Find One Company By Owner ID Use Case', () => {
  beforeEach(async () => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FindOneCompanyByOwnerIdUseCase(
      companiesRepository,
      usersRepository,
    )

    await usersRepository.create({
      id: 'user-id',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      phone_number: '933808187',
      username: 'johndoe',
    })

    await companiesRepository.create({
      id: 'company-id',
      name: 'Test Company',
      nif: '123456789',
      social_reason: 'Test Social Reason',
      registration_number: '123456789',
      document_code: '123456789',
      user_owner_id: 'user-id',
      email: 'company@example.com',
      phone_number: '123456789',
      street: 'Test Street',
      municipality_id: 'municipality-id',
    })
  })

  it('should be able to find one company by owner id', async () => {
    const { company } = await sut.execute({
      ownerId: 'user-id',
    })

    expect(company.id).toEqual('company-id')
    expect(company.name).toEqual('Test Company')
    expect(company.user_owner_id).toEqual('user-id')
  })

  it('should not be able to find a company with a non existing owner id', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to find a company if owner has no companies', async () => {
    await usersRepository.create({
      id: 'user-id-2',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: '123456',
      phone_number: '933808188',
      username: 'janedoe',
    })

    await expect(() =>
      sut.execute({
        ownerId: 'user-id-2',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
