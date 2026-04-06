import {
  GamingConsoleStatus,
  GamingTournamentStatus,
  PaymentMethod,
} from 'generated/prisma/enums'
import { z } from 'zod'

export const gamingBusinessUnitParamsSchema = z.object({
  businessUnitId: z.uuid(),
})

export const gamingEntityIdParamsSchema = gamingBusinessUnitParamsSchema.extend(
  {
    id: z.uuid(),
  },
)

export const gamingSessionIdParamsSchema = z.object({
  sessionId: z.uuid(),
})

export const createGamingCustomerBodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().trim(),
  phoneNumber: z.string().trim().min(1),
  notes: z.string().trim().optional().or(z.literal('')).nullable(),
})

export const updateGamingCustomerBodySchema =
  createGamingCustomerBodySchema.partial()

export const createGamingConsoleBodySchema = z.object({
  name: z.string().trim().min(2),
  brand: z.string().trim().optional().or(z.literal('')),
  model: z.string().trim().optional().or(z.literal('')),
  hourlyRate: z.number().positive().optional(),
  status: z.nativeEnum(GamingConsoleStatus).optional(),
  isActive: z.boolean().optional(),
})

export const updateGamingConsoleBodySchema =
  createGamingConsoleBodySchema.partial()

export const createGamingGameBodySchema = z.object({
  name: z.string().trim().min(2),
  genre: z.string().trim().optional().or(z.literal('')),
  hourlyRate: z.number().positive(),
  isActive: z.boolean().optional(),
})

export const updateGamingGameBodySchema = createGamingGameBodySchema.partial()

export const startGamingSessionBodySchema = z.object({
  customerId: z.uuid(),
  consoleId: z.uuid(),
  gameId: z.uuid(),
  startTime: z.coerce.date().optional(),
  notes: z.string().trim().optional().or(z.literal('')).nullable(),
})

export const endGamingSessionBodySchema = z.object({
  endTime: z.coerce.date().optional(),
})

export const createGamingSessionPaymentBodySchema = z.object({
  amount: z.number().positive(),
  method: z.nativeEnum(PaymentMethod),
  paymentDate: z.coerce.date().optional(),
})

export const createGamingExpenseBodySchema = z.object({
  description: z.string().trim().min(2),
  category: z.string().trim().optional().or(z.literal('')),
  amount: z.number().positive(),
  expenseDate: z.coerce.date().optional(),
  notes: z.string().trim().optional().or(z.literal('')).nullable(),
})

export const createGamingTournamentBodySchema = z.object({
  gameId: z.uuid().optional(),
  name: z.string().trim().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  entryFee: z.number().positive().optional(),
  prizePool: z.number().positive().optional(),
  status: z.enum(GamingTournamentStatus).optional(),
  winnerCustomerId: z.uuid().optional(),
})
