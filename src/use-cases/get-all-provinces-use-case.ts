import type { Province } from 'generated/prisma/client'
import type { ProvinceRepository } from '@/repositories/province-repository'

interface GetAllProvincesUseCaseResponse {
  provinces: Province[]
}

export class GetAllProvincesUseCase {
  constructor(private provinceRepository: ProvinceRepository) {}

  async execute(): Promise<GetAllProvincesUseCaseResponse> {
    const provinces = await this.provinceRepository.findAll()

    return {
      provinces,
    }
  }
}
