import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCompaniesRepository } from '@/repositories/in-memory/in-memory-companies-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { FindCompaniesByOwnerIdUseCase } from '@/use-cases/find-companies-by-owner-id-use-case'

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: InMemoryUsersRepository
let sut: FindCompaniesByOwnerIdUseCase

describe('Find Companies By Owner ID Use Case', () => {
  beforeEach(async () => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FindCompaniesByOwnerIdUseCase(
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
      id: 'company-id-1',
      name: 'Test Company 1',
      nif: '123456789',
      social_reason: 'Test Social Reason 1',
      registration_number: '123456789',
      document_code: '123456789',
      user_owner_id: 'user-id',
      email: 'company1@example.com',
      phone_number: '123456789',
      street: 'Test Street 1',
      municipality_id: 'municipality-id',
    })

    await companiesRepository.create({
      id: 'company-id-2',
      name: 'Test Company 2',
      nif: '987654321',
      social_reason: 'Test Social Reason 2',
      registration_number: '987654321',
      document_code: '987654321',
      user_owner_id: 'user-id',
      email: 'company2@example.com',
      phone_number: '987654321',
      street: 'Test Street 2',
      municipality_id: 'municipality-id',
    })
  })

  it('should be able to find all companies by owner id', async () => {
    const { companies } = await sut.execute({
      ownerId: 'user-id',
    })

    expect(companies).toHaveLength(2)
    expect(companies[0].user_owner_id).toEqual('user-id')
    expect(companies[1].user_owner_id).toEqual('user-id')
  })

  it('should return empty array if user has no companies', async () => {
    await usersRepository.create({
      id: 'user-id-2',
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: '123456',
      phone_number: '933808188',
      username: 'janedoe',
    })

    const { companies } = await sut.execute({
      ownerId: 'user-id-2',
    })

    expect(companies).toHaveLength(0)
  })

  it('should not be able to find companies with a non existing owner id', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
