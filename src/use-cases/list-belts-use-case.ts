import type {
  BeltData,
  BeltsRepository,
} from "@/repositories/belts-repository";

interface ListBeltsUseCaseResponse {
  belts: BeltData[];
}

export class ListBeltsUseCase {
  constructor(private beltsRepository: BeltsRepository) {}

  async execute(): Promise<ListBeltsUseCaseResponse> {
    const belts = await this.beltsRepository.findAll();
    return { belts };
  }
}
