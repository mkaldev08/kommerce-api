import type { GamingTournamentStatus } from "generated/prisma/enums";

export interface GamingTournamentData {
  id: string;
  businessUnitId: string;
  gameId?: string | null;
  name: string;
  startDate: Date;
  endDate?: Date | null;
  entryFee?: number | null;
  prizePool?: number | null;
  status: GamingTournamentStatus;
  winnerCustomerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGamingTournamentInput {
  businessUnitId: string;
  gameId?: string | null;
  name: string;
  startDate: Date;
  endDate?: Date | null;
  entryFee?: number | null;
  prizePool?: number | null;
  status?: GamingTournamentStatus;
  winnerCustomerId?: string | null;
}

export interface GamingTournamentsRepository {
  create(data: CreateGamingTournamentInput): Promise<GamingTournamentData>;
  findManyByBusinessUnitId(businessUnitId: string): Promise<GamingTournamentData[]>;
}
