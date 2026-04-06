import type {
    GamingGameData,
    GamingGamesRepository,
} from "@/repositories/gaming-games-repository";

interface ListGamingGamesUseCaseRequest {
  businessUnitId: string;
}

interface ListGamingGamesUseCaseResponse {
  games: GamingGameData[];
}

export class ListGamingGamesUseCase {
  constructor(private gamingGamesRepository: GamingGamesRepository) {}

  async execute(
    request: ListGamingGamesUseCaseRequest,
  ): Promise<ListGamingGamesUseCaseResponse> {
    const games = await this.gamingGamesRepository.findManyByBusinessUnitId(
      request.businessUnitId,
    );

    return { games };
  }
}
