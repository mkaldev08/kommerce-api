import type {
    CreateGamingGameInput,
    GamingGameData,
    GamingGamesRepository,
} from "@/repositories/gaming-games-repository";

interface UpdateGamingGameUseCaseRequest {
  id: string;
  data: Partial<Omit<CreateGamingGameInput, "businessUnitId">>;
}

interface UpdateGamingGameUseCaseResponse {
  game: GamingGameData;
}

export class UpdateGamingGameUseCase {
  constructor(private gamingGamesRepository: GamingGamesRepository) {}

  async execute(
    request: UpdateGamingGameUseCaseRequest,
  ): Promise<UpdateGamingGameUseCaseResponse> {
    const game = await this.gamingGamesRepository.update(request.id, request.data);

    return { game };
  }
}
