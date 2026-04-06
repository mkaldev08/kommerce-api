import type { GamingConsolesRepository } from "@/repositories/gaming-consoles-repository";

interface DeleteGamingConsoleUseCaseRequest {
  id: string;
}

export class DeleteGamingConsoleUseCase {
  constructor(private gamingConsolesRepository: GamingConsolesRepository) {}

  async execute(request: DeleteGamingConsoleUseCaseRequest): Promise<void> {
    await this.gamingConsolesRepository.delete(request.id);
  }
}
