import { CUSTOMERS } from '@/rbac/permissions'
import type { RouteDefinition } from '@/rbac/types'
import { defineRoute, storeRoute } from './helpers'

export const customersRoutes: RouteDefinition[] = [
  defineRoute('GET', '/customers', storeRoute(CUSTOMERS.READ)),
  defineRoute('GET', '/customers/:id', storeRoute(CUSTOMERS.READ)),
  defineRoute('POST', '/customers', storeRoute(CUSTOMERS.CREATE)),
  defineRoute('PATCH', '/customers/:id', storeRoute(CUSTOMERS.UPDATE)),
  defineRoute('DELETE', '/customers/:id', storeRoute(CUSTOMERS.DELETE)),
]
