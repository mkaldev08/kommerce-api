import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from 'generated/prisma/enums'
import { canRoleAccessOperation } from '@/rbac/core/rbac'
import type { PermissionOperation } from '@/rbac/permissions'
import { findRouteRule, findRuleByOperation } from '@/rbac/routes'
import type { PermissionRule, ScopeType } from '@/rbac/types'
import { resolveTargetBusinessUnitId } from '@/services/business-unit-resolver'

export {
  canRoleAccessOperation,
  MANAGER_PERMISSIONS,
  OPERATOR_PERMISSIONS,
} from '@/rbac/core/rbac'

type VerifyRoleOptions = {
  scope?: ScopeType
  requiredUnitType?: PermissionRule['requiredUnitType']
}

function resolvePermissionRule(
  request: FastifyRequest,
  operation: string | undefined,
  options: VerifyRoleOptions,
): PermissionRule | null {
  const matchedRuleFromUrl = request.url
    ? findRouteRule(request.method, request.url)
    : null

  const matchedRuleFromPattern = request.routeOptions.url
    ? findRouteRule(request.method, request.routeOptions.url)
    : null

  const matchedRule = matchedRuleFromUrl ?? matchedRuleFromPattern
  const fallbackRule = operation ? findRuleByOperation(operation) : null
  const baseRule = matchedRule ?? fallbackRule

  if (!baseRule) {
    return null
  }

  return {
    operation: (operation ?? baseRule.operation) as PermissionOperation,
    scope: options.scope ?? baseRule.scope,
    requiredUnitType: options.requiredUnitType ?? baseRule.requiredUnitType,
  }
}

export function verifyRoutePermission(
  operation?: string,
  options: VerifyRoleOptions = {},
) {
  return async function verifyPermissionForRoute(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const authUser = request.authUser
    if (!authUser) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }

    const routeRule = resolvePermissionRule(request, operation, options)

    if (!routeRule) {
      return reply.status(403).send({ message: 'Forbidden.' })
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

export function verifyRole(operation: string, options: VerifyRoleOptions = {}) {
  return verifyRoutePermission(operation, options)
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
