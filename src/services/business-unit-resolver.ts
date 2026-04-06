import type { FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'

function extractIdentifier(
  request: FastifyRequest,
  keys: string[],
): string | undefined {
  const containers = [
    request.params as Record<string, unknown>,
    request.query as Record<string, unknown>,
    request.body as Record<string, unknown>,
  ]

  for (const container of containers) {
    if (!container || typeof container !== 'object') {
      continue
    }

    for (const key of keys) {
      const value = container[key]
      if (typeof value === 'string' && value.trim().length > 0) {
        return value
      }
    }
  }

  return undefined
}

export async function resolveTargetBusinessUnitId(request: FastifyRequest) {
  const directBusinessUnitId = extractIdentifier(request, [
    'businessUnitId',
    'business_unit_id',
  ])

  if (directBusinessUnitId) {
    return directBusinessUnitId
  }

  const cashRegisterId = extractIdentifier(request, [
    'cashRegisterId',
    'cash_register_id',
  ])
  const workShiftId = extractIdentifier(request, [
    'workShiftId',
    'work_shift_id',
  ])
  const sessionId = extractIdentifier(request, ['sessionId', 'session_id'])
  const saleId = extractIdentifier(request, ['id'])
  const routeUrl = request.routeOptions.url ?? ''

  const queries = []

  if (cashRegisterId) {
    queries.push(
      prisma.cashRegister
        .findUnique({
          where: { id: cashRegisterId },
          select: { business_unit_id: true },
        })
        .then((cashRegister) => cashRegister?.business_unit_id),
    )
  }

  if (workShiftId) {
    queries.push(
      prisma.workShift
        .findUnique({
          where: { id: workShiftId },
          select: {
            cash_register: {
              select: {
                business_unit_id: true,
              },
            },
          },
        })
        .then((workShift) => workShift?.cash_register.business_unit_id),
    )
  }

  if (sessionId) {
    queries.push(
      prisma.gamingSession
        .findUnique({
          where: { id: sessionId },
          select: { business_unit_id: true },
        })
        .then((session) => session?.business_unit_id),
    )
  }

  if (saleId && routeUrl.startsWith('/sales/')) {
    queries.push(
      prisma.invoice
        .findUnique({
          where: { id: saleId },
          select: { business_unit_id: true },
        })
        .then((invoice) => invoice?.business_unit_id),
    )
  }

  if (queries.length > 0) {
    const results = await Promise.all(queries)
    const businessUnitId = results.find(
      (result) => result !== null && result !== undefined,
    )

    if (businessUnitId) {
      return businessUnitId
    }
  }

  return null
}
