import { GamingConsoleStatus, GamingSessionStatus } from "generated/prisma/enums";
import type { GamingConsolesRepository } from "@/repositories/gaming-consoles-repository";
import type {
    GamingSessionData,
    GamingSessionsRepository,
} from "@/repositories/gaming-sessions-repository";
import { GamingSessionAlreadyEndedError } from "./errors/gaming-session-already-ended-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface EndGamingSessionUseCaseRequest {
  sessionId: string;
  endTime?: Date;
}

interface EndGamingSessionUseCaseResponse {
  session: GamingSessionData;
}

function diffMinutes(startTime: Date, endTime: Date): number {
  const ms = endTime.getTime() - startTime.getTime();
  return Math.max(1, Math.ceil(ms / 60000));
}

function roundAmount(value: number): number {
  return Number(value.toFixed(2));
}

export class EndGamingSessionUseCase {
  constructor(
    private gamingSessionsRepository: GamingSessionsRepository,
    private gamingConsolesRepository: GamingConsolesRepository,
  ) {}

  async execute(
    request: EndGamingSessionUseCaseRequest,
  ): Promise<EndGamingSessionUseCaseResponse> {
    const session = await this.gamingSessionsRepository.findById(request.sessionId);

    if (!session) {
      throw new ResourceNotFoundError();
    }

    if (session.status !== GamingSessionStatus.ACTIVE) {
      throw new GamingSessionAlreadyEndedError();
    }

    const endTime = request.endTime || new Date();
    const durationMinutes = diffMinutes(session.startTime, endTime);
    const totalAmount = roundAmount((durationMinutes / 60) * session.hourlyRate);

    const updatedSession = await this.gamingSessionsRepository.end({
      id: session.id,
      endTime,
      durationMinutes,
      totalAmount,
    });

    await this.gamingConsolesRepository.updateStatus(
      session.consoleId,
      GamingConsoleStatus.AVAILABLE,
    );

    return { session: updatedSession };
  }
}
