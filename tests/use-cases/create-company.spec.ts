import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryBusinessUnitRepository } from "@/repositories/in-memory/in-memory-business-unit-repository";
import { InMemoryCompaniesRepository } from "@/repositories/in-memory/in-memory-companies-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { CreateCompanyUseCase } from "@/use-cases/create-company-use-case";
import { CompanyAlreadyExistsError } from "@/use-cases/errors/company-already-exists-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let companiesRepository: InMemoryCompaniesRepository;
let businessUnitRepository: InMemoryBusinessUnitRepository;
let sut: CreateCompanyUseCase;

describe("Create Company Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    companiesRepository = new InMemoryCompaniesRepository();
    businessUnitRepository = new InMemoryBusinessUnitRepository();
    sut = new CreateCompanyUseCase(
      usersRepository,
      companiesRepository,
      businessUnitRepository,
    );

    await usersRepository.create({
      id: "user-id",
      full_name: "John Doe",
      email: "johndoe@example.com",
      password_hash: "123456",
      phone_number: "933808187",
      username: "johndoe",
    });
  });

  it("Should be able to create a company", async () => {
    const { company } = await sut.execute({
      trade_name: "Company Name",
      commercial_registry: "123456789",
      document_code: "DOC-123",
      legal_name: "Social Reason",
      owner_id: "user-id",
      email: "company@example.com",
      phone_number: "123456789",
      street_address: "Street Name",
      municipality_id: "municipality-id",
    });

    expect(company.id).toEqual(expect.any(String));
  });

  it("should create default business units for a new company", async () => {
    const { company } = await sut.execute({
      trade_name: "Company Name",
      commercial_registry: "123456789",
      document_code: "DOC-123",
      legal_name: "Social Reason",
      owner_id: "user-id",
      email: "company@example.com",
      phone_number: "123456789",
      street_address: "Street Name",
      municipality_id: "municipality-id",
    });

    const businessUnits = await businessUnitRepository.findByCompanyId(
      company.id,
    );

    expect(businessUnits).toHaveLength(3);
    expect(businessUnits.map((unit) => unit.type)).toEqual(
      expect.arrayContaining(["STORE", "ACADEMY", "GAMING_HOUSE"]),
    );
  });

  it("should not be able to create a company with a non existing user", async () => {
    await expect(() =>
      sut.execute({
        trade_name: "Company Name",
        commercial_registry: "123456789",
        document_code: "DOC-123",
        legal_name: "Social Reason",
        owner_id: "non-existing-user-id",
        email: "company@example.com",
        phone_number: "123456789",
        street_address: "Street Name",
        municipality_id: "municipality-id",
      }),
    ).rejects.instanceOf(ResourceNotFoundError);
  });

  it("should not be able to create a company with a duplicated commercial registry", async () => {
    await sut.execute({
      trade_name: "Company Name",
      commercial_registry: "123456789",
      document_code: "DOC-123",
      legal_name: "Social Reason",
      owner_id: "user-id",
      email: "company@example.com",
      phone_number: "123456789",
      street_address: "Street Name",
      municipality_id: "municipality-id",
    });

    await expect(() =>
      sut.execute({
        trade_name: "Another Company",
        commercial_registry: "123456789",
        document_code: "DOC-456",
        legal_name: "Social Reason",
        owner_id: "user-id",
        email: "other@example.com",
        phone_number: "987654321",
        street_address: "Street Name",
        municipality_id: "municipality-id",
      }),
    ).rejects.instanceOf(CompanyAlreadyExistsError);
  });

  it("should not be able to create a company with a duplicated email", async () => {
    await sut.execute({
      trade_name: "Company Name",
      commercial_registry: "123456789",
      document_code: "DOC-123",
      legal_name: "Social Reason",
      owner_id: "user-id",
      email: "company@example.com",
      phone_number: "123456789",
      street_address: "Street Name",
      municipality_id: "municipality-id",
    });

    await expect(() =>
      sut.execute({
        trade_name: "Another Company",
        commercial_registry: "987654321",
        document_code: "DOC-456",
        legal_name: "Social Reason",
        owner_id: "user-id",
        email: "company@example.com",
        phone_number: "987654321",
        street_address: "Street Name",
        municipality_id: "municipality-id",
      }),
    ).rejects.instanceOf(CompanyAlreadyExistsError);
  });

  it("should not be able to create a company with a duplicated phone number", async () => {
    await sut.execute({
      trade_name: "Company Name",
      commercial_registry: "123456789",
      document_code: "DOC-123",
      legal_name: "Social Reason",
      owner_id: "user-id",
      email: "company@example.com",
      phone_number: "123456789",
      street_address: "Street Name",
      municipality_id: "municipality-id",
    });

    await expect(() =>
      sut.execute({
        trade_name: "Another Company",
        commercial_registry: "987654321",
        document_code: "DOC-456",
        legal_name: "Social Reason",
        owner_id: "user-id",
        email: "other@example.com",
        phone_number: "123456789",
        street_address: "Street Name",
        municipality_id: "municipality-id",
      }),
    ).rejects.instanceOf(CompanyAlreadyExistsError);
  });
});
