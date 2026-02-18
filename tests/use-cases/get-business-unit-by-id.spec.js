import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryBusinessUnitRepository } from '@/repositories/in-memory/in-memory-business-unit-repository';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { GetBusinessUnitByIdUseCase } from '@/use-cases/get-business-unit-by-id-use-case';
let businessUnitRepository;
let sut;
describe('Get Business Unit By ID Use Case', () => {
    beforeEach(async () => {
        businessUnitRepository = new InMemoryBusinessUnitRepository();
        sut = new GetBusinessUnitByIdUseCase(businessUnitRepository);
        await businessUnitRepository.create({
            name: 'Test Business Unit',
            type: 'LOJA',
            description: 'A test business unit',
            address: 'Test Address 123',
            company_id: 'company-id',
        });
    });
    it('should be able to get a business unit by id', async () => {
        const businessUnits = await businessUnitRepository.findByCompanyId('company-id');
        const businessUnitId = businessUnits[0].id;
        const { businessUnit } = await sut.execute({
            businessUnitId,
        });
        expect(businessUnit.id).toEqual(businessUnitId);
        expect(businessUnit.name).toEqual('Test Business Unit');
        expect(businessUnit.type).toEqual('LOJA');
        expect(businessUnit.description).toEqual('A test business unit');
        expect(businessUnit.address).toEqual('Test Address 123');
    });
    it('should not be able to get a business unit with a non existing id', async () => {
        await expect(() => sut.execute({
            businessUnitId: 'non-existing-id',
        })).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
