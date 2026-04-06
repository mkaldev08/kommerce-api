import type {
    CreateGamingGameInput,
    GamingGameData,
    GamingGamesRepository,
} from "@/repositories/gaming-games-repository";

interface CreateGamingGameUseCaseResponse {
  game: GamingGameData;
}

export class CreateGamingGameUseCase {
  constructor(private gamingGamesRepository: GamingGamesRepository) {}

  async execute(
    input: CreateGamingGameInput,
  ): Promise<CreateGamingGameUseCaseResponse> {
    const game = await this.gamingGamesRepository.create(input);

    return { game };
  }
}
