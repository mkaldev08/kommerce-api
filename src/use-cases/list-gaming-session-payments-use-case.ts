import type {
    GamingSessionPaymentData,
    GamingSessionPaymentsRepository,
} from "@/repositories/gaming-session-payments-repository";

interface ListGamingSessionPaymentsUseCaseRequest {
  sessionId: string;
}

interface ListGamingSessionPaymentsUseCaseResponse {
  payments: GamingSessionPaymentData[];
  totalPaid: number;
}

export class ListGamingSessionPaymentsUseCase {
  constructor(
    private gamingSessionPaymentsRepository: GamingSessionPaymentsRepository,
  ) {}

  async execute(
    request: ListGamingSessionPaymentsUseCaseRequest,
  ): Promise<ListGamingSessionPaymentsUseCaseResponse> {
    const [payments, totalPaid] = await Promise.all([
      this.gamingSessionPaymentsRepository.findManyBySessionId(request.sessionId),
      this.gamingSessionPaymentsRepository.getTotalPaidBySessionId(request.sessionId),
    ]);

    return {
      payments,
      totalPaid: Number(totalPaid.toFixed(2)),
    };
  }
}
