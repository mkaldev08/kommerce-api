export interface RevenueBucket {
  label: string;
  revenue: number;
}

export interface MostUsedConsoleItem {
  consoleId: string;
  consoleName: string;
  sessionsCount: number;
}

export interface MostPlayedGameItem {
  gameId: string;
  gameName: string;
  sessionsCount: number;
}

export interface GamingReportsRepository {
  getRevenueByDay(businessUnitId: string, days: number): Promise<RevenueBucket[]>;
  getRevenueByMonth(businessUnitId: string, months: number): Promise<RevenueBucket[]>;
  getMostUsedConsoles(
    businessUnitId: string,
    limit: number,
  ): Promise<MostUsedConsoleItem[]>;
  getMostPlayedGames(
    businessUnitId: string,
    limit: number,
  ): Promise<MostPlayedGameItem[]>;
}
