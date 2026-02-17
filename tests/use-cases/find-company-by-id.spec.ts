import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCompaniesRepository } from '@/repositories/in-memory/in-memory-companies-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { FindCompanyByIdUseCase } from '@/use-cases/find-company-by-id-use-case'

let companiesRepository: InMemoryCompaniesRepository
let usersRepository: InMemoryUsersRepository
let sut: FindCompanyByIdUseCase

describe('Find Company By ID Use Case', () => {
  beforeEach(async () => {
    companiesRepository = new InMemoryCompaniesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FindCompanyByIdUseCase(companiesRepository)

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

  it('should be able to find a company by id', async () => {
    const { company } = await sut.execute({
      companyId: 'company-id',
    })

    expect(company.id).toEqual('company-id')
    expect(company.name).toEqual('Test Company')
    expect(company.nif).toEqual('123456789')
  })

  it('should not be able to find a company with a non existing id', async () => {
    await expect(() =>
      sut.execute({
        companyId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
