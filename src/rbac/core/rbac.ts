import * as RBACPackage from '@rbac/rbac'
import type { UserRole } from 'generated/prisma/enums'
import {
  ACADEMY,
  CUSTOMERS,
  GAMING,
  INVENTORY,
  SALES,
  SHARED,
} from '@/rbac/permissions'

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
  SHARED.DASHBOARD_READ,
  SHARED.PROVINCES_READ,
  SHARED.BUSINESS_UNITS_READ,
  INVENTORY.CATEGORIES_CREATE,
  INVENTORY.CATEGORIES_READ,
  INVENTORY.PRODUCTS_CREATE,
  INVENTORY.PRODUCTS_READ,
  INVENTORY.PRODUCTS_UPDATE,
  INVENTORY.PRODUCTS_DELETE,
  CUSTOMERS.CREATE,
  CUSTOMERS.READ,
  CUSTOMERS.UPDATE,
  CUSTOMERS.DELETE,
  ACADEMY.STUDENTS_CREATE,
  ACADEMY.STUDENTS_READ,
  ACADEMY.STUDENTS_UPDATE,
  ACADEMY.STUDENTS_DELETE,
  ACADEMY.ENROLLMENTS_CREATE,
  ACADEMY.ENROLLMENTS_READ,
  ACADEMY.ENROLLMENTS_UPDATE,
  ACADEMY.ENROLLMENTS_DELETE,
  ACADEMY.ENROLLMENTS_READ_PDF,
  ACADEMY.ENROLLMENTS_REGISTER_PAYMENT,
  ACADEMY.ENROLLMENTS_READ_FINANCIAL_PLANS,
  ACADEMY.READ,
  ACADEMY.CREATE,
  GAMING.CREATE,
  GAMING.READ,
  GAMING.UPDATE,
  GAMING.DELETE,
  GAMING.PAYMENTS_CREATE,
  GAMING.PAYMENTS_READ,
  GAMING.REPORTS_READ,
  SALES.CREATE,
  SALES.READ,
  SALES.READ_PDF,
  SALES.UPDATE_STATUS,
  SHARED.CASH_REGISTERS_OPEN,
  SHARED.CASH_REGISTERS_READ_OPEN,
  SHARED.CASH_REGISTERS_CLOSE,
  SHARED.WORK_SHIFTS_OPEN,
  SHARED.WORK_SHIFTS_READ_OPEN,
  SHARED.WORK_SHIFTS_CLOSE,
  SHARED.CASH_MOVEMENTS_CREATE,
  SHARED.CASH_MOVEMENTS_READ,
  SHARED.AUTH_CREATE_USER,
] as const

export const OPERATOR_PERMISSIONS = MANAGER_PERMISSIONS.filter(
  (permission) => permission !== SHARED.AUTH_CREATE_USER,
)

const VIEWER_PERMISSIONS = [
  SHARED.PROVINCES_READ,
  SHARED.BUSINESS_UNITS_READ,
] as const

function initializeRBAC() {
  return rbacFactory({
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
