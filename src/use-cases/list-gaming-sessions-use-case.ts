import type {
    GamingSessionDetails,
    GamingSessionsRepository,
} from "@/repositories/gaming-sessions-repository";

interface ListGamingSessionsUseCaseRequest {
  businessUnitId: string;
}

interface ListGamingSessionsUseCaseResponse {
  sessions: GamingSessionDetails[];
}

export class ListGamingSessionsUseCase {
  constructor(private gamingSessionsRepository: GamingSessionsRepository) {}

  async execute(
    request: ListGamingSessionsUseCaseRequest,
  ): Promise<ListGamingSessionsUseCaseResponse> {
    const sessions = await this.gamingSessionsRepository.findManyByBusinessUnitId(
      request.businessUnitId,
    );

    return { sessions };
  }
}
