import * as RBACPackage from '@rbac/rbac'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { BusinessUnitType, UserRole } from 'generated/prisma/enums'
import { prisma } from '@/lib/prisma'

type ScopeType = 'none' | 'business-unit'

type PermissionRule = {
  operation: string
  requiredUnitType?: BusinessUnitType
  scope: ScopeType
}

type AppRole = UserRole | 'VIEWER'

type RBACConfig = {
  can: (
    role: string,
    operation: string | RegExp,
    params?: { userId?: string },
  ) => Promise<boolean>
}

const rbacFactory = RBACPackage.default as (config?: {
  enableLogger?: boolean
}) => (roles: Record<string, unknown>) => RBACConfig

export const MANAGER_PERMISSIONS = [
  'dashboard:read',
  'provinces:read',
  'business-units:read',
  'inventory:categories:create',
  'inventory:categories:read',
  'inventory:products:create',
  'inventory:products:read',
  'inventory:products:update',
  'inventory:products:delete',
  'customers:create',
  'customers:read',
  'customers:update',
  'customers:delete',
  'students:create',
  'students:read',
  'students:update',
  'students:delete',
  'enrollments:create',
  'enrollments:read',
  'enrollments:update',
  'enrollments:delete',
  'enrollments:read-pdf',
  'enrollments:register-payment',
  'enrollments:read-financial-plans',
  'academy:read',
  'academy:create',
  'gaming-house:create',
  'gaming-house:read',
  'gaming-house:update',
  'gaming-house:delete',
  'gaming-house:payments:create',
  'gaming-house:payments:read',
  'gaming-house:reports:read',
  'sales:create',
  'sales:read',
  'sales:read-pdf',
  'sales:update-status',
  'cash-registers:open',
  'cash-registers:read-open',
  'cash-registers:close',
  'work-shifts:open',
  'work-shifts:read-open',
  'work-shifts:close',
  'cash-movements:create',
  'cash-movements:read',
  'auth:create-user',
] as const

export const OPERATOR_PERMISSIONS = MANAGER_PERMISSIONS.filter(
  (permission) => permission !== 'auth:create-user',
)

const VIEWER_PERMISSIONS = ['provinces:read', 'business-units:read'] as const

// Initialize RBAC with memoization to avoid recreating on each request
const initializeRBAC = () => {
  const rbacInstance = rbacFactory({
    enableLogger: false,
  })({
    ADMIN: {
      can: ['*'],
    },
    MANAGER: {
      can: MANAGER_PERMISSIONS as unknown as string[],
    },
    OPERATOR: {
      can: OPERATOR_PERMISSIONS as unknown as string[],
    },
    VIEWER: {
      can: VIEWER_PERMISSIONS as unknown as string[],
    },
  })

  return rbacInstance
}

let cachedRBAC: RBACConfig | null = null

function getConfiguredRBAC(): RBACConfig {
  if (!cachedRBAC) {
    cachedRBAC = initializeRBAC()
  }
  return cachedRBAC
}

export async function canRoleAccessOperation(
  role: AppRole,
  operation: string,
  userId?: string,
) {
  const rbac = getConfiguredRBAC()
  return rbac.can(role, operation, { userId })
}

const DEFAULT_PERMISSION_RULES: Record<
  string,
  Omit<PermissionRule, 'operation'>
> = {
  'provinces:read': { scope: 'none' },
  'business-units:read': { scope: 'business-unit' },
  'dashboard:read': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'inventory:categories:read': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'none',
  },
  'inventory:categories:create': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'none',
  },
  'inventory:products:read': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'inventory:products:create': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'inventory:products:update': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'inventory:products:delete': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'customers:read': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'customers:create': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'customers:update': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'customers:delete': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'sales:read': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'sales:create': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'sales:read-pdf': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'sales:update-status': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'cash-registers:open': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'cash-registers:read-open': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'cash-registers:close': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'work-shifts:open': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'work-shifts:read-open': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'work-shifts:close': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'cash-movements:create': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'cash-movements:read': {
    requiredUnitType: BusinessUnitType.STORE,
    scope: 'business-unit',
  },
  'students:create': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'students:read': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'students:update': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'students:delete': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'enrollments:create': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'enrollments:read': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'enrollments:update': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'enrollments:delete': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'enrollments:read-pdf': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'enrollments:register-payment': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'enrollments:read-financial-plans': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'business-unit',
  },
  'academy:read': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'none',
  },
  'academy:create': {
    requiredUnitType: BusinessUnitType.ACADEMY,
    scope: 'none',
  },
  'gaming-house:create': {
    requiredUnitType: BusinessUnitType.GAMING_HOUSE,
    scope: 'business-unit',
  },
  'gaming-house:read': {
    requiredUnitType: BusinessUnitType.GAMING_HOUSE,
    scope: 'business-unit',
  },
  'gaming-house:update': {
    requiredUnitType: BusinessUnitType.GAMING_HOUSE,
    scope: 'business-unit',
  },
  'gaming-house:delete': {
    requiredUnitType: BusinessUnitType.GAMING_HOUSE,
    scope: 'business-unit',
  },
  'gaming-house:payments:create': {
    requiredUnitType: BusinessUnitType.GAMING_HOUSE,
    scope: 'business-unit',
  },
  'gaming-house:payments:read': {
    requiredUnitType: BusinessUnitType.GAMING_HOUSE,
    scope: 'business-unit',
  },
  'gaming-house:reports:read': {
    requiredUnitType: BusinessUnitType.GAMING_HOUSE,
    scope: 'business-unit',
  },
  'auth:create-user': { scope: 'business-unit' },
}

type VerifyRoleOptions = {
  scope?: ScopeType
  requiredUnitType?: BusinessUnitType
}

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

async function resolveTargetBusinessUnitId(request: FastifyRequest) {
  const directBusinessUnitId = extractIdentifier(request, [
    'businessUnitId',
    'business_unit_id',
  ])

  if (directBusinessUnitId) {
    return directBusinessUnitId
  }

  // Build a lookup key from route parameters and request data
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

  // Prepare queries based on what identifiers were found
  const queries = []

  if (cashRegisterId) {
    queries.push(
      prisma.cashRegister
        .findUnique({
          where: { id: cashRegisterId },
          select: { business_unit_id: true },
        })
        .then((cr) => cr?.business_unit_id),
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
        .then((ws) => ws?.cash_register.business_unit_id),
    )
  }

  if (sessionId) {
    queries.push(
      prisma.gamingSession
        .findUnique({
          where: { id: sessionId },
          select: { business_unit_id: true },
        })
        .then((s) => s?.business_unit_id),
    )
  }

  if (saleId && routeUrl.startsWith('/sales/')) {
    queries.push(
      prisma.invoice
        .findUnique({
          where: { id: saleId },
          select: { business_unit_id: true },
        })
        .then((inv) => inv?.business_unit_id),
    )
  }

  // Execute all queries in parallel and return first result
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

export function verifyRole(operation: string, options: VerifyRoleOptions = {}) {
  const defaultRule = DEFAULT_PERMISSION_RULES[operation]
  const routeRule: PermissionRule = {
    operation,
    scope: options.scope ?? defaultRule?.scope ?? 'business-unit',
    requiredUnitType: options.requiredUnitType ?? defaultRule?.requiredUnitType,
  }

  return async function verifyPermissionForOperation(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const authUser = request.authUser

    if (!authUser) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }

    const hasOperationPermission = await canRoleAccessOperation(
      authUser.role,
      routeRule.operation,
      authUser.id,
    )

    if (!hasOperationPermission) {
      return reply.status(403).send({ message: 'Forbidden.' })
    }

    if (authUser.role === UserRole.ADMIN) {
      return
    }

    if (!authUser.businessUnitId) {
      return reply.status(403).send({ message: 'Forbidden.' })
    }

    if (
      routeRule.requiredUnitType &&
      authUser.businessUnitType !== routeRule.requiredUnitType
    ) {
      return reply.status(403).send({ message: 'Forbidden.' })
    }

    if (routeRule.scope === 'business-unit') {
      const targetBusinessUnitId = await resolveTargetBusinessUnitId(request)

      if (!targetBusinessUnitId) {
        return reply.status(403).send({ message: 'Forbidden.' })
      }

      if (targetBusinessUnitId !== authUser.businessUnitId) {
        return reply.status(403).send({ message: 'Forbidden.' })
      }
    }
  }
}

export async function verifyAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authUser = request.authUser

  if (!authUser) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  if (authUser.role !== UserRole.ADMIN) {
    return reply.status(403).send({ message: 'Forbidden.' })
  }
}
