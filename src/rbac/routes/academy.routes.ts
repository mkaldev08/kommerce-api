import { ACADEMY } from '@/rbac/permissions'
import type { RouteDefinition } from '@/rbac/types'
import { academyRoute, defineRoute } from './helpers'

export const academyRoutes: RouteDefinition[] = [
  defineRoute(
    'GET',
    '/business-units/:businessUnitId/students',
    academyRoute(ACADEMY.STUDENTS_READ),
  ),
  defineRoute(
    'GET',
    '/business-units/:businessUnitId/students/:id',
    academyRoute(ACADEMY.STUDENTS_READ),
  ),
  defineRoute(
    'POST',
    '/business-units/:businessUnitId/students',
    academyRoute(ACADEMY.STUDENTS_CREATE),
  ),
  defineRoute(
    'PATCH',
    '/business-units/:businessUnitId/students/:id',
    academyRoute(ACADEMY.STUDENTS_UPDATE),
  ),
  defineRoute(
    'DELETE',
    '/business-units/:businessUnitId/students/:id',
    academyRoute(ACADEMY.STUDENTS_DELETE),
  ),
  defineRoute('GET', '/academy/belts', academyRoute(ACADEMY.READ, 'none')),
  defineRoute('POST', '/academy/belts', academyRoute(ACADEMY.CREATE, 'none')),
  defineRoute(
    'GET',
    '/academy/tuition-fees',
    academyRoute(ACADEMY.READ, 'none'),
  ),
  defineRoute(
    'POST',
    '/academy/tuition-fees',
    academyRoute(ACADEMY.CREATE, 'none'),
  ),
  defineRoute(
    'GET',
    '/academy/school-years',
    academyRoute(ACADEMY.READ, 'none'),
  ),
  defineRoute(
    'POST',
    '/academy/school-years',
    academyRoute(ACADEMY.CREATE, 'none'),
  ),
  defineRoute(
    'GET',
    '/academy/instructors',
    academyRoute(ACADEMY.READ, 'none'),
  ),
  defineRoute(
    'POST',
    '/academy/instructors',
    academyRoute(ACADEMY.CREATE, 'none'),
  ),
  defineRoute(
    'GET',
    '/business-units/:businessUnitId/enrollments',
    academyRoute(ACADEMY.ENROLLMENTS_READ),
  ),
  defineRoute(
    'POST',
    '/business-units/:businessUnitId/enrollments',
    academyRoute(ACADEMY.ENROLLMENTS_CREATE),
  ),
  defineRoute(
    'PATCH',
    '/business-units/:businessUnitId/enrollments/:id',
    academyRoute(ACADEMY.ENROLLMENTS_UPDATE),
  ),
  defineRoute(
    'DELETE',
    '/business-units/:businessUnitId/enrollments/:id',
    academyRoute(ACADEMY.ENROLLMENTS_DELETE),
  ),
  defineRoute(
    'GET',
    '/business-units/:businessUnitId/enrollments/:id/report/pdf',
    academyRoute(ACADEMY.ENROLLMENTS_READ_PDF),
  ),
  defineRoute(
    'POST',
    '/business-units/:businessUnitId/enrollments/:id/payments',
    academyRoute(ACADEMY.ENROLLMENTS_REGISTER_PAYMENT),
  ),
  defineRoute(
    'GET',
    '/business-units/:businessUnitId/enrollments/:id/financial-plans',
    academyRoute(ACADEMY.ENROLLMENTS_READ_FINANCIAL_PLANS),
  ),
  defineRoute(
    'GET',
    '/business-units/:businessUnitId/payments/recent',
    academyRoute(ACADEMY.ENROLLMENTS_READ),
  ),
]
