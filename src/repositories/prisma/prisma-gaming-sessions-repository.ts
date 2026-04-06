import type { GamingSession } from "generated/prisma/client";
import { GamingSessionStatus } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type {
    EndGamingSessionInput,
    GamingSessionData,
    GamingSessionDetails,
    GamingSessionsRepository,
    StartGamingSessionInput,
} from "../gaming-sessions-repository";

export class PrismaGamingSessionsRepository implements GamingSessionsRepository {
  async start(data: StartGamingSessionInput): Promise<GamingSessionData> {
    const session = await prisma.gamingSession.create({
      data: {
        business_unit_id: data.businessUnitId,
        customer_id: data.customerId,
        console_id: data.consoleId,
        game_id: data.gameId,
        start_time: data.startTime,
        hourly_rate: data.hourlyRate,
        notes: data.notes || null,
        status: GamingSessionStatus.ACTIVE,
      },
    });

    return this.toGamingSessionData(session);
  }

  async findById(id: string): Promise<GamingSessionData | null> {
    const session = await prisma.gamingSession.findUnique({
      where: { id },
    });

    return session ? this.toGamingSessionData(session) : null;
  }

  async findByIdWithDetails(id: string): Promise<GamingSessionDetails | null> {
    const session = await prisma.gamingSession.findUnique({
      where: { id },
      include: {
        customer: { select: { name: true } },
        console: { select: { name: true } },
        game: { select: { name: true } },
      },
    });

    if (!session) {
      return null;
    }

    return {
      ...this.toGamingSessionData(session),
      customerName: session.customer.name,
      consoleName: session.console.name,
      gameName: session.game.name,
    };
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<GamingSessionDetails[]> {
    const sessions = await prisma.gamingSession.findMany({
      where: { business_unit_id: businessUnitId },
      include: {
        customer: { select: { name: true } },
        console: { select: { name: true } },
        game: { select: { name: true } },
      },
      orderBy: { start_time: "desc" },
    });

    return sessions.map((session) => ({
      ...this.toGamingSessionData(session),
      customerName: session.customer.name,
      consoleName: session.console.name,
      gameName: session.game.name,
    }));
  }

  async findActiveByConsoleId(consoleId: string): Promise<GamingSessionData | null> {
    const session = await prisma.gamingSession.findFirst({
      where: {
        console_id: consoleId,
        status: GamingSessionStatus.ACTIVE,
      },
      orderBy: { start_time: "desc" },
    });

    return session ? this.toGamingSessionData(session) : null;
  }

  async end(data: EndGamingSessionInput): Promise<GamingSessionData> {
    const session = await prisma.gamingSession.update({
      where: { id: data.id },
      data: {
        end_time: data.endTime,
        duration_minutes: data.durationMinutes,
        total_amount: data.totalAmount,
        status: GamingSessionStatus.COMPLETED,
      },
    });

    return this.toGamingSessionData(session);
  }

  private toGamingSessionData(session: GamingSession): GamingSessionData {
    return {
      id: session.id,
      businessUnitId: session.business_unit_id,
      customerId: session.customer_id,
      consoleId: session.console_id,
      gameId: session.game_id,
      startTime: session.start_time,
      endTime: session.end_time,
      durationMinutes: session.duration_minutes,
      hourlyRate: Number(session.hourly_rate),
      totalAmount: session.total_amount !== null ? Number(session.total_amount) : null,
      status: session.status,
      notes: session.notes,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    };
  }
}
