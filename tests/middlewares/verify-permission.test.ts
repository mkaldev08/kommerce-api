import { BusinessUnitType, UserRole } from 'generated/prisma/enums'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    cashRegister: { findUnique: vi.fn() },
    workShift: { findUnique: vi.fn() },
    gamingSession: { findUnique: vi.fn() },
    invoice: { findUnique: vi.fn() },
  },
}))

import {
  canRoleAccessOperation,
  verifyRole,
} from '@/middlewares/verify-permission'

describe('verify-permission RBAC', () => {
  it('allows manager to create users', async () => {
    const allowed = await canRoleAccessOperation(
      UserRole.MANAGER,
      'auth:create-user',
      'u-1',
    )

    expect(allowed).toBe(true)
  })

  it('denies operator from creating users', async () => {
    const allowed = await canRoleAccessOperation(
      UserRole.OPERATOR,
      'auth:create-user',
      'u-2',
    )

    expect(allowed).toBe(false)
  })
})

describe('verifyRole unit scoping', () => {
  it('denies manager access to a different business unit', async () => {
    const status = vi.fn().mockReturnThis()
    const send = vi.fn().mockReturnThis()
    const guard = verifyRole('inventory:products:read')

    const request = {
      method: 'GET',
      routeOptions: { url: '/inventory/products' },
      params: {},
      body: {},
      query: { businessUnitId: 'bu-2' },
      authUser: {
        id: 'u-3',
        role: UserRole.MANAGER,
        businessUnitId: 'bu-1',
        businessUnitType: BusinessUnitType.STORE,
      },
    }

    await guard(request as never, { status, send } as never)

    expect(status).toHaveBeenCalledWith(403)
    expect(send).toHaveBeenCalledWith({ message: 'Forbidden.' })
  })

  it('allows manager access inside assigned business unit', async () => {
    const status = vi.fn().mockReturnThis()
    const send = vi.fn().mockReturnThis()
    const guard = verifyRole('inventory:products:read')

    const request = {
      method: 'GET',
      routeOptions: { url: '/inventory/products' },
      params: {},
      body: {},
      query: { businessUnitId: 'bu-1' },
      authUser: {
        id: 'u-4',
        role: UserRole.MANAGER,
        businessUnitId: 'bu-1',
        businessUnitType: BusinessUnitType.STORE,
      },
    }

    await guard(request as never, { status, send } as never)

    expect(status).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })
})
