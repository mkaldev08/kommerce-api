import type { FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { BusinessUnitNotStoreError } from '@/use-cases/errors/business-unit-not-store-error'
import { CashBalanceMismatchError } from '@/use-cases/errors/cash-balance-mismatch-error'
import { CashRegisterAlreadyOpenError } from '@/use-cases/errors/cash-register-already-open-error'
import { CashRegisterClosedError } from '@/use-cases/errors/cash-register-closed-error'
import { CompanyAlreadyExistsError } from '@/use-cases/errors/company-already-exists-error'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { InvalidUserRoleAssignmentError } from '@/use-cases/errors/invalid-user-role-assignment-error'
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { WorkShiftAlreadyOpenError } from '@/use-cases/errors/work-shift-already-open-error'
import { WorkShiftNotOpenError } from '@/use-cases/errors/work-shift-not-open-error'
import { WorkShiftStillOpenError } from '@/use-cases/errors/work-shift-still-open-error'

export function handleControllerError(
  reply: FastifyReply,
  error: unknown,
): boolean {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: 'Erro de validação',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })

    return true
  }

  if (error instanceof ResourceNotFoundError) {
    reply.status(404).send({ message: 'Recurso não encontrado' })
    return true
  }

  if (error instanceof InvoiceNotFoundError) {
    reply.status(404).send({ message: 'Venda não encontrada' })
    return true
  }

  if (error instanceof InvalidCredentialsError) {
    reply.status(401).send({ message: 'Credenciais inválidas' })
    return true
  }

  if (error instanceof InvalidUserRoleAssignmentError) {
    reply.status(400).send({ message: error.message })
    return true
  }

  if (
    error instanceof CompanyAlreadyExistsError ||
    error instanceof UserAlreadyExistsError
  ) {
    reply.status(409).send({ message: 'Recurso já existe' })
    return true
  }

  if (error instanceof CashBalanceMismatchError) {
    reply.status(400).send({ message: 'Saldo de caixa inválido' })
    return true
  }

  if (error instanceof BusinessUnitNotStoreError) {
    reply
      .status(400)
      .send({ message: 'A unidade de negócio não permite operação de caixa' })
    return true
  }

  if (error instanceof CashRegisterClosedError) {
    reply.status(400).send({ message: 'Caixa fechado' })
    return true
  }

  if (error instanceof WorkShiftNotOpenError) {
    reply.status(400).send({ message: 'Turno não está aberto' })
    return true
  }

  if (error instanceof WorkShiftStillOpenError) {
    reply
      .status(400)
      .send({ message: 'Existe turno em aberto para este caixa' })
    return true
  }

  if (
    error instanceof CashRegisterAlreadyOpenError ||
    error instanceof WorkShiftAlreadyOpenError
  ) {
    reply
      .status(409)
      .send({ message: 'Já existe registo aberto para esta operação' })
    return true
  }

  return false
}
