import type { FastifyInstance } from 'fastify'
import { authenticateUser } from './controllers/authenticate-controller'
import { CreateCompany } from './controllers/create-company-controller'
import { FindCompaniesByOwnerId } from './controllers/find-companies-by-owner-id-controller'
import { FindCompanyById } from './controllers/find-company-by-id-controller'
import { FindOneCompanyByOwnerId } from './controllers/find-one-company-by-owner-id-controller'
import { GetAllProvinces } from './controllers/get-all-provinces-controller'
import { GetBusinessUnitsByCompanyIdController } from './controllers/get-business-units-by-company-id-controller'
import { GetMunicipalitiesByProvinceId } from './controllers/get-municipalities-by-province-id-controller'
import { logoutUser } from './controllers/logout-controller'
import { registerUser } from './controllers/register-user-controller'

export function appRoutes(app: FastifyInstance) {
  app.post('/companies/:ownerId', CreateCompany)
  app.get('/companies/:companyId', FindCompanyById)
  app.get('/companies/owner/:ownerId', FindCompaniesByOwnerId)

  app.get('/owner/:ownerId/company', FindOneCompanyByOwnerId)
  app.post('/logout', logoutUser)

  app.get(
    '/business-units/company/:companyId',
    GetBusinessUnitsByCompanyIdController,
  )

  app.get('/provinces', GetAllProvinces)
  app.get(
    '/provinces/:provinceId/municipalities',
    GetMunicipalitiesByProvinceId,
  )
}

export function nonAuthenticatedRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)
}
