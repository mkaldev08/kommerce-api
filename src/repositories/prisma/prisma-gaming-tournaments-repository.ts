import type { GamingTournament } from "generated/prisma/client";
import { GamingTournamentStatus } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
    CreateGamingTournamentInput,
    GamingTournamentData,
    GamingTournamentsRepository,
} from "../gaming-tournaments-repository";

export class PrismaGamingTournamentsRepository
  implements GamingTournamentsRepository
{
  async create(data: CreateGamingTournamentInput): Promise<GamingTournamentData> {
    const tournament = await prisma.gamingTournament.create({
      data: {
        business_unit_id: data.businessUnitId,
        game_id: data.gameId || null,
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate || null,
        entry_fee: data.entryFee ?? null,
        prize_pool: data.prizePool ?? null,
        status: data.status || GamingTournamentStatus.PLANNED,
        winner_customer_id: data.winnerCustomerId || null,
      },
    });

    return this.toTournamentData(tournament);
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<GamingTournamentData[]> {
    const tournaments = await prisma.gamingTournament.findMany({
      where: { business_unit_id: businessUnitId },
      orderBy: { start_date: "desc" },
    });

    return tournaments.map((tournament) => this.toTournamentData(tournament));
  }

  private toTournamentData(tournament: GamingTournament): GamingTournamentData {
    return {
      id: tournament.id,
      businessUnitId: tournament.business_unit_id,
      gameId: tournament.game_id,
      name: tournament.name,
      startDate: tournament.start_date,
      endDate: tournament.end_date,
      entryFee: tournament.entry_fee !== null ? Number(tournament.entry_fee) : null,
      prizePool: tournament.prize_pool !== null ? Number(tournament.prize_pool) : null,
      status: tournament.status,
      winnerCustomerId: tournament.winner_customer_id,
      createdAt: tournament.created_at,
      updatedAt: tournament.updated_at,
    };
  }
}
