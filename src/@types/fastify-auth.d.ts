import type { BusinessUnitType, UserRole } from '../../generated/prisma/enums'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      role?: UserRole
      sub: string
    }
    user: {
      role?: UserRole
      sub: string
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: {
      id: string
      role: UserRole
      businessUnitId: string | null
      businessUnitType: BusinessUnitType | null
    }
  }
}
