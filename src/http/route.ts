import type { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register-user'

export function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', registerUser) // Temporary placeholder
}
