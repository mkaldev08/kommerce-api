import type {
    GamingTournamentData,
    GamingTournamentsRepository,
} from "@/repositories/gaming-tournaments-repository";

interface ListGamingTournamentsUseCaseRequest {
  businessUnitId: string;
}

interface ListGamingTournamentsUseCaseResponse {
  tournaments: GamingTournamentData[];
}

export class ListGamingTournamentsUseCase {
  constructor(private gamingTournamentsRepository: GamingTournamentsRepository) {}

  async execute(
    request: ListGamingTournamentsUseCaseRequest,
  ): Promise<ListGamingTournamentsUseCaseResponse> {
    const tournaments =
      await this.gamingTournamentsRepository.findManyByBusinessUnitId(
        request.businessUnitId,
      );

    return { tournaments };
  }
}
