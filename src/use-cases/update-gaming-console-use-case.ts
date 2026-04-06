import type {
    CreateGamingConsoleInput,
    GamingConsoleData,
    GamingConsolesRepository,
} from "@/repositories/gaming-consoles-repository";

interface UpdateGamingConsoleUseCaseRequest {
  id: string;
  data: Partial<Omit<CreateGamingConsoleInput, "businessUnitId">>;
}

interface UpdateGamingConsoleUseCaseResponse {
  console: GamingConsoleData;
}

export class UpdateGamingConsoleUseCase {
  constructor(private gamingConsolesRepository: GamingConsolesRepository) {}

  async execute(
    request: UpdateGamingConsoleUseCaseRequest,
  ): Promise<UpdateGamingConsoleUseCaseResponse> {
    const console = await this.gamingConsolesRepository.update(
      request.id,
      request.data,
    );

    return { console };
  }
}
