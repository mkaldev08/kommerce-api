import type {
    GamingConsoleData,
    GamingConsolesRepository,
} from "@/repositories/gaming-consoles-repository";

interface ListGamingConsolesUseCaseRequest {
  businessUnitId: string;
}

interface ListGamingConsolesUseCaseResponse {
  consoles: GamingConsoleData[];
}

export class ListGamingConsolesUseCase {
  constructor(private gamingConsolesRepository: GamingConsolesRepository) {}

  async execute(
    request: ListGamingConsolesUseCaseRequest,
  ): Promise<ListGamingConsolesUseCaseResponse> {
    const consoles = await this.gamingConsolesRepository.findManyByBusinessUnitId(
      request.businessUnitId,
    );

    return { consoles };
  }
}
