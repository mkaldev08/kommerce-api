import { BusinessUnitType } from 'generated/prisma/enums'
import type { PermissionOperation } from '@/rbac/permissions'
import type { PermissionRule, RouteDefinition, ScopeType } from '@/rbac/types'

function createRuleBuilder(requiredUnitType?: BusinessUnitType) {
  return (
    operation: PermissionOperation,
    scope: ScopeType = 'business-unit',
  ): PermissionRule => ({
    operation,
    requiredUnitType,
    scope,
  })
}

export const storeRoute = createRuleBuilder(BusinessUnitType.STORE)
export const academyRoute = createRuleBuilder(BusinessUnitType.ACADEMY)
export const gamingRoute = createRuleBuilder(BusinessUnitType.GAMING_HOUSE)
export const businessUnitRoute = createRuleBuilder()

export const publicRoute = (
  operation: PermissionOperation,
): PermissionRule => ({
  operation,
  scope: 'none',
})

export function defineRoute(
  method: string,
  pattern: string,
  rule: PermissionRule,
): RouteDefinition {
  return {
    method: method.toUpperCase(),
    pattern,
    rule,
  }
}
