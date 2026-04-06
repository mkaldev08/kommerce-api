import { PrismaCashMovementsRepository } from '@/repositories/prisma/prisma-cash-movements-repository'
import { PrismaCashRegistersRepository } from '@/repositories/prisma/prisma-cash-registers-repository'
import { PrismaGamingSessionPaymentsRepository } from '@/repositories/prisma/prisma-gaming-session-payments-repository'
import { PrismaGamingSessionsRepository } from '@/repositories/prisma/prisma-gaming-sessions-repository'
import { RegisterGamingSessionPaymentUseCase } from '../register-gaming-session-payment-use-case'

export function makeRegisterGamingSessionPaymentUseCase(): RegisterGamingSessionPaymentUseCase {
  const gamingSessionsRepository = new PrismaGamingSessionsRepository()
  const gamingSessionPaymentsRepository =
    new PrismaGamingSessionPaymentsRepository()
  const cashRegistersRepository = new PrismaCashRegistersRepository()
  const cashMovementsRepository = new PrismaCashMovementsRepository()
  const useCase = new RegisterGamingSessionPaymentUseCase(
    gamingSessionsRepository,
    gamingSessionPaymentsRepository,
    cashRegistersRepository,
    cashMovementsRepository,
  )

  return useCase
}
