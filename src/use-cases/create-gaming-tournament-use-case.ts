import type {
    CreateGamingTournamentInput,
    GamingTournamentData,
    GamingTournamentsRepository,
} from "@/repositories/gaming-tournaments-repository";

interface CreateGamingTournamentUseCaseResponse {
  tournament: GamingTournamentData;
}

export class CreateGamingTournamentUseCase {
  constructor(private gamingTournamentsRepository: GamingTournamentsRepository) {}

  async execute(
    input: CreateGamingTournamentInput,
  ): Promise<CreateGamingTournamentUseCaseResponse> {
    const tournament = await this.gamingTournamentsRepository.create(input);

    return { tournament };
  }
}
