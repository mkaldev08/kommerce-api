import { GamingSessionStatus } from 'generated/prisma/enums'
import type { CashMovementsRepository } from '@/repositories/cash-movements-repository'
import type { CashRegistersRepository } from '@/repositories/cash-registers-repository'
import type {
  CreateGamingSessionPaymentInput,
  GamingSessionPaymentData,
  GamingSessionPaymentsRepository,
} from '@/repositories/gaming-session-payments-repository'
import type { GamingSessionsRepository } from '@/repositories/gaming-sessions-repository'
import { CashRegisterClosedError } from '@/use-cases/errors/cash-register-closed-error'
import { GamingSessionPaymentExceedsTotalError } from './errors/gaming-session-payment-exceeds-total-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface RegisterGamingSessionPaymentUseCaseRequest
  extends CreateGamingSessionPaymentInput {}

interface RegisterGamingSessionPaymentUseCaseResponse {
  payment: GamingSessionPaymentData
  remainingAmount: number
  paidAmount: number
}

function roundAmount(value: number): number {
  return Number(value.toFixed(2))
}

function diffMinutes(startTime: Date, endTime: Date): number {
  const ms = endTime.getTime() - startTime.getTime()
  return Math.max(1, Math.ceil(ms / 60000))
}

export class RegisterGamingSessionPaymentUseCase {
  constructor(
    private gamingSessionsRepository: GamingSessionsRepository,
    private gamingSessionPaymentsRepository: GamingSessionPaymentsRepository,
    private cashRegistersRepository: CashRegistersRepository,
    private cashMovementsRepository: CashMovementsRepository,
  ) {}

  async execute(
    request: RegisterGamingSessionPaymentUseCaseRequest,
  ): Promise<RegisterGamingSessionPaymentUseCaseResponse> {
    const session = await this.gamingSessionsRepository.findById(
      request.sessionId,
    )

    if (!session) {
      throw new ResourceNotFoundError()
    }

    const paidAmount =
      await this.gamingSessionPaymentsRepository.getTotalPaidBySessionId(
        request.sessionId,
      )

    const referenceTotalAmount =
      session.totalAmount != null
        ? session.totalAmount
        : session.status === GamingSessionStatus.ACTIVE
          ? roundAmount(
              (diffMinutes(
                session.startTime,
                request.paymentDate ?? new Date(),
              ) /
                60) *
                session.hourlyRate,
            )
          : 0

    const newPaidAmount = paidAmount + request.amount

    if (newPaidAmount - referenceTotalAmount > 0.01) {
      throw new GamingSessionPaymentExceedsTotalError()
    }

    const payment = await this.gamingSessionPaymentsRepository.create(request)

    if (request.method === 'CASH') {
      const openCashRegister =
        await this.cashRegistersRepository.findOpenByBusinessUnitId(
          session.businessUnitId,
        )

      if (!openCashRegister) {
        throw new CashRegisterClosedError()
      }

      await this.cashMovementsRepository.create({
        cashRegisterId: openCashRegister.id,
        type: 'ENTRY',
        amount: request.amount,
        description: `Entrada automática do pagamento da sessão ${session.id}`,
        movementDate: request.paymentDate ?? new Date(),
      })
    }

    return {
      payment,
      paidAmount: Number(newPaidAmount.toFixed(2)),
      remainingAmount: Number(
        (referenceTotalAmount - newPaidAmount).toFixed(2),
      ),
    }
  }
}
