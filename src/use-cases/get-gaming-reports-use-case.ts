import type {
    GamingReportsRepository,
    MostPlayedGameItem,
    MostUsedConsoleItem,
    RevenueBucket,
} from "@/repositories/gaming-reports-repository";

interface GetGamingReportsUseCaseRequest {
  businessUnitId: string;
}

interface GetGamingReportsUseCaseResponse {
  revenueByDay: RevenueBucket[];
  revenueByWeek: RevenueBucket[];
  revenueByMonth: RevenueBucket[];
  mostUsedConsoles: MostUsedConsoleItem[];
  mostPlayedGames: MostPlayedGameItem[];
}

export class GetGamingReportsUseCase {
  constructor(private gamingReportsRepository: GamingReportsRepository) {}

  async execute(
    request: GetGamingReportsUseCaseRequest,
  ): Promise<GetGamingReportsUseCaseResponse> {
    const [revenueByDay, revenueByWeek, revenueByMonth, mostUsedConsoles, mostPlayedGames] =
      await Promise.all([
        this.gamingReportsRepository.getRevenueByDay(request.businessUnitId, 7),
        this.gamingReportsRepository.getRevenueByDay(request.businessUnitId, 28),
        this.gamingReportsRepository.getRevenueByMonth(request.businessUnitId, 12),
        this.gamingReportsRepository.getMostUsedConsoles(request.businessUnitId, 5),
        this.gamingReportsRepository.getMostPlayedGames(request.businessUnitId, 5),
      ]);

    return {
      revenueByDay,
      revenueByWeek,
      revenueByMonth,
      mostUsedConsoles,
      mostPlayedGames,
    };
  }
}
