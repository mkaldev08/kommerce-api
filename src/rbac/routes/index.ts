import { type MatchFunction, match } from 'path-to-regexp'
import type { PermissionRule, RouteDefinition } from '@/rbac/types'
import { academyRoutes } from './academy.routes'
import { customersRoutes } from './customers.routes'
import { gamingRoutes } from './gaming.routes'
import { inventoryRoutes } from './inventory.routes'
import { salesRoutes } from './sales.routes'

const routeRegistry: RouteDefinition[] = [
  ...inventoryRoutes,
  ...customersRoutes,
  ...academyRoutes,
  ...gamingRoutes,
  ...salesRoutes,
]

type CompiledRoute = {
  method: string
  matcher: MatchFunction<object>
  rule: PermissionRule
}

const matcherCache = new Map<string, MatchFunction<object>>()

function getMatcher(pattern: string): MatchFunction<object> {
  const cachedMatcher = matcherCache.get(pattern)
  if (cachedMatcher) {
    return cachedMatcher
  }

  const matcher = match(pattern, {
    decode: decodeURIComponent,
    end: true,
  })

  matcherCache.set(pattern, matcher)
  return matcher
}

const compiledRoutes: CompiledRoute[] = routeRegistry.map((route) => ({
  method: route.method.toUpperCase(),
  matcher: getMatcher(route.pattern),
  rule: route.rule,
}))

const operationRuleMap = new Map<string, Omit<PermissionRule, 'operation'>>()

for (const route of routeRegistry) {
  if (!operationRuleMap.has(route.rule.operation)) {
    operationRuleMap.set(route.rule.operation, {
      scope: route.rule.scope,
      requiredUnitType: route.rule.requiredUnitType,
    })
  }
}

function normalizeUrl(url: string): string {
  const queryParamIndex = url.indexOf('?')
  if (queryParamIndex === -1) {
    return url
  }

  return url.slice(0, queryParamIndex)
}

export function findRouteRule(
  method: string,
  url: string,
): PermissionRule | null {
  const normalizedMethod = method.toUpperCase()
  const normalizedUrl = normalizeUrl(url)

  const directTemplateMatch = routeRegistry.find(
    (route) =>
      route.method.toUpperCase() === normalizedMethod &&
      route.pattern === normalizedUrl,
  )

  if (directTemplateMatch) {
    return directTemplateMatch.rule
  }

  for (const route of compiledRoutes) {
    if (route.method !== normalizedMethod) {
      continue
    }

    if (route.matcher(normalizedUrl)) {
      return route.rule
    }
  }

  return null
}

export function findRuleByOperation(operation: string): PermissionRule | null {
  const operationRule = operationRuleMap.get(operation)
  if (!operationRule) {
    return null
  }

  return {
    operation: operation as PermissionRule['operation'],
    scope: operationRule.scope,
    requiredUnitType: operationRule.requiredUnitType,
  }
}
