import type { GamingGamesRepository } from "@/repositories/gaming-games-repository";

interface DeleteGamingGameUseCaseRequest {
  id: string;
}

export class DeleteGamingGameUseCase {
  constructor(private gamingGamesRepository: GamingGamesRepository) {}

  async execute(request: DeleteGamingGameUseCaseRequest): Promise<void> {
    await this.gamingGamesRepository.delete(request.id);
  }
}
