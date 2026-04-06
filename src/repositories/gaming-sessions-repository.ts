import type { GamingSessionStatus, } from "generated/prisma/enums";

export interface GamingSessionData {
  id: string;
  businessUnitId: string;
  customerId: string;
  consoleId: string;
  gameId: string;
  startTime: Date;
  endTime?: Date | null;
  durationMinutes?: number | null;
  hourlyRate: number;
  totalAmount?: number | null;
  status: GamingSessionStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StartGamingSessionInput {
  businessUnitId: string;
  customerId: string;
  consoleId: string;
  gameId: string;
  startTime: Date;
  hourlyRate: number;
  notes?: string | null;
}

export interface EndGamingSessionInput {
  id: string;
  endTime: Date;
  durationMinutes: number;
  totalAmount: number;
}

export interface GamingSessionDetails extends GamingSessionData {
  customerName: string;
  consoleName: string;
  gameName: string;
}

export interface GamingSessionsRepository {
  start(data: StartGamingSessionInput): Promise<GamingSessionData>;
  findById(id: string): Promise<GamingSessionData | null>;
  findByIdWithDetails(id: string): Promise<GamingSessionDetails | null>;
  findManyByBusinessUnitId(businessUnitId: string): Promise<GamingSessionDetails[]>;
  findActiveByConsoleId(consoleId: string): Promise<GamingSessionData | null>;
  end(data: EndGamingSessionInput): Promise<GamingSessionData>;
}
