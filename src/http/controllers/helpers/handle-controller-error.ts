import type { FastifyReply } from 'fastify'
import z from 'zod'
import { env } from '@/env'
import { AcademyFinancialConfigMissingError } from '@/use-cases/errors/academy-financial-config-missing-error'
import { BusinessUnitNotAcademyError } from '@/use-cases/errors/business-unit-not-academy-error'
import { BusinessUnitNotGamingHouseError } from '@/use-cases/errors/business-unit-not-gaming-house-error'
import { CashRegisterClosedError } from '@/use-cases/errors/cash-register-closed-error'
import { GamingConsoleNotAvailableError } from '@/use-cases/errors/gaming-console-not-available-error'
import { GamingSessionAlreadyEndedError } from '@/use-cases/errors/gaming-session-already-ended-error'
import { GamingSessionPaymentExceedsTotalError } from '@/use-cases/errors/gaming-session-payment-exceeds-total-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Prisma } from '../../../../generated/prisma/client'

export function handleControllerError(
  reply: FastifyReply,
  error: unknown,
): boolean {
  if (error instanceof z.ZodError) {
    reply.status(400).send({
      message: 'Dados inválidos no pedido.',
      issues: error.issues,
    })
    return true
  }

  if (error instanceof ResourceNotFoundError) {
    reply.status(404).send({ message: error.message })
    return true
  }

  if (error instanceof BusinessUnitNotAcademyError) {
    reply.status(400).send({ message: error.message })
    return true
  }

  if (error instanceof BusinessUnitNotGamingHouseError) {
    reply.status(400).send({ message: error.message })
    return true
  }

  if (error instanceof CashRegisterClosedError) {
    reply.status(400).send({ message: 'Caixa fechado' })
    return true
  }

  if (error instanceof GamingConsoleNotAvailableError) {
    reply.status(409).send({ message: error.message })
    return true
  }

  if (error instanceof GamingSessionAlreadyEndedError) {
    reply.status(409).send({ message: error.message })
    return true
  }

  if (error instanceof GamingSessionPaymentExceedsTotalError) {
    reply.status(400).send({ message: error.message })
    return true
  }

  if (error instanceof AcademyFinancialConfigMissingError) {
    reply.status(400).send({ message: error.message })
    return true
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target)
        ? error.meta?.target.join(', ')
        : String(error.meta?.target ?? 'campo único')

      reply.status(409).send({
        message: `Conflito de dados: valor duplicado em ${target}`,
      })
      return true
    }

    if (error.code === 'P2003') {
      reply.status(400).send({
        message: 'Referência inválida para relacionamento.',
      })
      return true
    }

    if (error.code === 'P2025') {
      reply.status(404).send({
        message: 'Registo não encontrado.',
      })
      return true
    }

    if (error.code === 'P2022') {
      reply.status(500).send({
        message:
          'Schema da base de dados desatualizado. Execute as migrações pendentes.',
      })
      return true
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    reply.status(400).send({
      message: 'Dados inválidos para a operação solicitada.',
      ...(env.NODE_ENV === 'production' ? {} : { detail: error.message }),
    })
    return true
  }

  return false
}
