import { INVENTORY, SHARED } from '@/rbac/permissions'
import type { RouteDefinition } from '@/rbac/types'
import {
  businessUnitRoute,
  defineRoute,
  publicRoute,
  storeRoute,
} from './helpers'

export const inventoryRoutes: RouteDefinition[] = [
  defineRoute(
    'POST',
    '/auth/users',
    businessUnitRoute(SHARED.AUTH_CREATE_USER),
  ),
  defineRoute(
    'GET',
    '/business-units/:businessUnitId',
    businessUnitRoute(SHARED.BUSINESS_UNITS_READ),
  ),
  defineRoute(
    'GET',
    '/business-units/:businessUnitId/dashboard',
    storeRoute(SHARED.DASHBOARD_READ),
  ),
  defineRoute('GET', '/provinces', publicRoute(SHARED.PROVINCES_READ)),
  defineRoute(
    'GET',
    '/provinces/:provinceId/municipalities',
    publicRoute(SHARED.PROVINCES_READ),
  ),
  defineRoute(
    'GET',
    '/inventory/products',
    storeRoute(INVENTORY.PRODUCTS_READ),
  ),
  defineRoute(
    'GET',
    '/inventory/products/:productId',
    storeRoute(INVENTORY.PRODUCTS_READ),
  ),
  defineRoute(
    'POST',
    '/inventory/products',
    storeRoute(INVENTORY.PRODUCTS_CREATE),
  ),
  defineRoute(
    'PATCH',
    '/inventory/products/:productId',
    storeRoute(INVENTORY.PRODUCTS_UPDATE),
  ),
  defineRoute(
    'DELETE',
    '/inventory/products/:productId',
    storeRoute(INVENTORY.PRODUCTS_DELETE),
  ),
  defineRoute(
    'GET',
    '/inventory/categories',
    storeRoute(INVENTORY.CATEGORIES_READ, 'none'),
  ),
  defineRoute(
    'POST',
    '/inventory/categories',
    storeRoute(INVENTORY.CATEGORIES_CREATE, 'none'),
  ),
]
