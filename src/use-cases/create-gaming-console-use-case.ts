import type {
    CreateGamingConsoleInput,
    GamingConsoleData,
    GamingConsolesRepository,
} from "@/repositories/gaming-consoles-repository";

interface CreateGamingConsoleUseCaseResponse {
  console: GamingConsoleData;
}

export class CreateGamingConsoleUseCase {
  constructor(private gamingConsolesRepository: GamingConsolesRepository) {}

  async execute(
    input: CreateGamingConsoleInput,
  ): Promise<CreateGamingConsoleUseCaseResponse> {
    const console = await this.gamingConsolesRepository.create(input);

    return { console };
  }
}
