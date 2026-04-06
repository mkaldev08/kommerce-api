import type { BusinessUnitType } from 'generated/prisma/enums'
import type { PermissionOperation } from './permissions'

export type ScopeType = 'none' | 'business-unit'

export type PermissionRule = {
  operation: PermissionOperation
  requiredUnitType?: BusinessUnitType
  scope: ScopeType
}

export type RouteDefinition = {
  pattern: string
  method: string
  rule: PermissionRule
}
