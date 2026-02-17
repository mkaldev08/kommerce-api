import type { FastifyInstance } from 'fastify'
import { authenticateUser } from './controllers/authenticate-controller'
import { CreateCompany } from './controllers/create-company-controller'
import { FindCompaniesByOwnerId } from './controllers/find-companies-by-owner-id-controller'
import { FindCompanyById } from './controllers/find-company-by-id-controller'
import { FindOneCompanyByOwnerId } from './controllers/find-one-company-by-owner-id-controller'
import { registerUser } from './controllers/register-user-controller'

export function appRoutes(app: FastifyInstance) {
  app.post('/companies/:ownerId', CreateCompany)
  app.get('/companies/:companyId', FindCompanyById)
  app.get('/companies/owner/:ownerId', FindCompaniesByOwnerId)

  app.get('/owner/:ownerId/company', FindOneCompanyByOwnerId)
}

export function nonAuthenticatedRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)
}
