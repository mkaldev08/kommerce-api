import { GamingSessionStatus } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
    GamingReportsRepository,
    MostPlayedGameItem,
    MostUsedConsoleItem,
    RevenueBucket,
} from "../gaming-reports-repository";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export class PrismaGamingReportsRepository implements GamingReportsRepository {
  async getRevenueByDay(
    businessUnitId: string,
    days: number,
  ): Promise<RevenueBucket[]> {
    const startDate = new Date(Date.now() - days * DAY_IN_MS);

    const sessions = await prisma.gamingSession.findMany({
      where: {
        business_unit_id: businessUnitId,
        status: GamingSessionStatus.COMPLETED,
        end_time: { gte: startDate },
      },
      select: {
        end_time: true,
        total_amount: true,
      },
      orderBy: { end_time: "asc" },
    });

    const revenueMap = new Map<string, number>();

    for (const session of sessions) {
      if (!session.end_time || session.total_amount === null) {
        continue;
      }

      const key = toDayKey(session.end_time);
      revenueMap.set(key, (revenueMap.get(key) || 0) + Number(session.total_amount));
    }

    return [...revenueMap.entries()].map(([label, revenue]) => ({
      label,
      revenue: Number(revenue.toFixed(2)),
    }));
  }

  async getRevenueByMonth(
    businessUnitId: string,
    months: number,
  ): Promise<RevenueBucket[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const sessions = await prisma.gamingSession.findMany({
      where: {
        business_unit_id: businessUnitId,
        status: GamingSessionStatus.COMPLETED,
        end_time: { gte: startDate },
      },
      select: {
        end_time: true,
        total_amount: true,
      },
      orderBy: { end_time: "asc" },
    });

    const revenueMap = new Map<string, number>();

    for (const session of sessions) {
      if (!session.end_time || session.total_amount === null) {
        continue;
      }

      const key = toMonthKey(session.end_time);
      revenueMap.set(key, (revenueMap.get(key) || 0) + Number(session.total_amount));
    }

    return [...revenueMap.entries()].map(([label, revenue]) => ({
      label,
      revenue: Number(revenue.toFixed(2)),
    }));
  }

  async getMostUsedConsoles(
    businessUnitId: string,
    limit: number,
  ): Promise<MostUsedConsoleItem[]> {
    const rows = await prisma.gamingSession.groupBy({
      by: ["console_id"],
      where: {
        business_unit_id: businessUnitId,
        status: GamingSessionStatus.COMPLETED,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          console_id: "desc",
        },
      },
      take: limit,
    });

    const consoles = await prisma.gamingConsole.findMany({
      where: {
        id: {
          in: rows.map((row) => row.console_id),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const consoleMap = new Map(consoles.map((consoleUnit) => [consoleUnit.id, consoleUnit.name]));

    return rows.map((row) => ({
      consoleId: row.console_id,
      consoleName: consoleMap.get(row.console_id) || "Console",
      sessionsCount: row._count._all,
    }));
  }

  async getMostPlayedGames(
    businessUnitId: string,
    limit: number,
  ): Promise<MostPlayedGameItem[]> {
    const rows = await prisma.gamingSession.groupBy({
      by: ["game_id"],
      where: {
        business_unit_id: businessUnitId,
        status: GamingSessionStatus.COMPLETED,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          game_id: "desc",
        },
      },
      take: limit,
    });

    const games = await prisma.gamingGame.findMany({
      where: {
        id: {
          in: rows.map((row) => row.game_id),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const gameMap = new Map(games.map((game) => [game.id, game.name]));

    return rows.map((row) => ({
      gameId: row.game_id,
      gameName: gameMap.get(row.game_id) || "Jogo",
      sessionsCount: row._count._all,
    }));
  }
}
