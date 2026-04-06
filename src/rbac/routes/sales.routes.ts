import { SALES, SHARED } from '@/rbac/permissions'
import type { RouteDefinition } from '@/rbac/types'
import { defineRoute, storeRoute } from './helpers'

export const salesRoutes: RouteDefinition[] = [
  defineRoute('POST', '/sales', storeRoute(SALES.CREATE)),
  defineRoute('GET', '/sales', storeRoute(SALES.READ)),
  defineRoute('GET', '/sales/:id', storeRoute(SALES.READ)),
  defineRoute('GET', '/sales/:id/report/pdf', storeRoute(SALES.READ_PDF)),
  defineRoute('PATCH', '/sales/:id/status', storeRoute(SALES.UPDATE_STATUS)),
  defineRoute(
    'POST',
    '/cash-registers/open',
    storeRoute(SHARED.CASH_REGISTERS_OPEN),
  ),
  defineRoute(
    'GET',
    '/cash-registers/business-unit/:businessUnitId/open',
    storeRoute(SHARED.CASH_REGISTERS_READ_OPEN),
  ),
  defineRoute(
    'POST',
    '/cash-registers/:cashRegisterId/close',
    storeRoute(SHARED.CASH_REGISTERS_CLOSE),
  ),
  defineRoute('POST', '/work-shifts/open', storeRoute(SHARED.WORK_SHIFTS_OPEN)),
  defineRoute(
    'GET',
    '/work-shifts/cash-register/:cashRegisterId/open',
    storeRoute(SHARED.WORK_SHIFTS_READ_OPEN),
  ),
  defineRoute(
    'POST',
    '/work-shifts/:workShiftId/close',
    storeRoute(SHARED.WORK_SHIFTS_CLOSE),
  ),
  defineRoute(
    'POST',
    '/cash-movements',
    storeRoute(SHARED.CASH_MOVEMENTS_CREATE),
  ),
  defineRoute('GET', '/cash-movements', storeRoute(SHARED.CASH_MOVEMENTS_READ)),
]
