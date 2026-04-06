import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from 'fastify'
import { verifyJWT } from '@/middlewares/verify-jwt'
import { verifyAdmin, verifyRole } from '@/middlewares/verify-permission'
import { authenticateUser } from './controllers/authenticate-controller'
import { closeCashRegisterController } from './controllers/close-cash-register-controller'
import { closeWorkShiftController } from './controllers/close-work-shift-controller'
import { CreateBeltController } from './controllers/create-belt-controller'
import { createCashMovementController } from './controllers/create-cash-movement-controller'
import { CreateCategoryController } from './controllers/create-category-controller'
import { CreateClassController } from './controllers/create-class-controller'
import { CreateCompany } from './controllers/create-company-controller'
import { CreateCustomerController } from './controllers/create-customer-controller'
import { CreateEnrollmentController } from './controllers/create-enrollment-controller'
import { CreateGamingConsoleController } from './controllers/create-gaming-console-controller'
import { CreateGamingCustomerController } from './controllers/create-gaming-customer-controller'
import { CreateGamingExpenseController } from './controllers/create-gaming-expense-controller'
import { CreateGamingGameController } from './controllers/create-gaming-game-controller'
import { CreateGamingSessionPaymentController } from './controllers/create-gaming-session-payment-controller'
import { CreateGamingTournamentController } from './controllers/create-gaming-tournament-controller'
import { CreateInstructorController } from './controllers/create-instructor-controller'
import { createManagedUserController } from './controllers/create-managed-user-controller'
import { CreateProductController } from './controllers/create-product-controller'
import { createSaleController } from './controllers/create-sale-controller'
import { CreateSchoolYearController } from './controllers/create-school-year-controller'
import { CreateStudentController } from './controllers/create-student-controller'
import { CreateTuitionFeeController } from './controllers/create-tuition-fee-controller'
import { DeleteCustomerController } from './controllers/delete-customer-controller'
import { DeleteEnrollmentController } from './controllers/delete-enrollment-controller'
import { DeleteGamingConsoleController } from './controllers/delete-gaming-console-controller'
import { DeleteGamingCustomerController } from './controllers/delete-gaming-customer-controller'
import { DeleteGamingGameController } from './controllers/delete-gaming-game-controller'
import { DeleteProductController } from './controllers/delete-product-controller'
import { DeleteStudentController } from './controllers/delete-student-controller'
import { EndGamingSessionController } from './controllers/end-gaming-session-controller'
import { exportEnrollmentPdfController } from './controllers/export-enrollment-pdf-controller'
import { exportInvoicePdfController } from './controllers/export-invoice-pdf-controller'
import { FindCompaniesByOwnerId } from './controllers/find-companies-by-owner-id-controller'
import { FindCompanyById } from './controllers/find-company-by-id-controller'
import { FindCustomerByIdController } from './controllers/find-customer-by-id-controller'
import { FindOneCompanyByOwnerId } from './controllers/find-one-company-by-owner-id-controller'
import { FindStudentByIdController } from './controllers/find-student-by-id-controller'
import { GetAllProvinces } from './controllers/get-all-provinces-controller'
import { getAppUpdateAssetController } from './controllers/get-app-update-asset-controller'
import { GetBusinessUnitByIdController } from './controllers/get-business-unit-by-id-controller'
import { GetBusinessUnitsByCompanyIdController } from './controllers/get-business-units-by-company-id-controller'
import { getCompanyDashboardMetricsController } from './controllers/get-company-dashboard-metrics-controller'
import { getCompanyLogoController } from './controllers/get-company-logo-controller'
import { getDashboardMetricsController } from './controllers/get-dashboard-metrics-controller'
import { GetGamingReportsController } from './controllers/get-gaming-reports-controller'
import { GetMunicipalitiesByProvinceId } from './controllers/get-municipalities-by-province-id-controller'
import { getOpenCashRegisterController } from './controllers/get-open-cash-register-controller'
import { getOpenWorkShiftController } from './controllers/get-open-work-shift-controller'
import { GetProductByIdController } from './controllers/get-product-by-id-controller'
import { getSaleController } from './controllers/get-sale-controller'
import { ListBeltsController } from './controllers/list-belts-controller'
import { listCashMovementsController } from './controllers/list-cash-movements-controller'
import { ListCategoriesController } from './controllers/list-categories-controller'
import { ListClassesController } from './controllers/list-classes-controller'
import { ListCustomersController } from './controllers/list-customers-controller'
import { ListEnrollmentFinancialPlansController } from './controllers/list-enrollment-financial-plans-controller'
import { ListEnrollmentsController } from './controllers/list-enrollments-controller'
import { ListGamingConsolesController } from './controllers/list-gaming-consoles-controller'
import { ListGamingCustomersController } from './controllers/list-gaming-customers-controller'
import { ListGamingExpensesController } from './controllers/list-gaming-expenses-controller'
import { ListGamingGamesController } from './controllers/list-gaming-games-controller'
import { ListGamingSessionPaymentsController } from './controllers/list-gaming-session-payments-controller'
import { ListGamingSessionsController } from './controllers/list-gaming-sessions-controller'
import { ListGamingTournamentsController } from './controllers/list-gaming-tournaments-controller'
import { ListInstructorsController } from './controllers/list-instructors-controller'
import { ListProductsController } from './controllers/list-products-controller'
import { ListRecentEnrollmentPaymentsController } from './controllers/list-recent-enrollment-payments-controller'
import { listSalesController } from './controllers/list-sales-controller'
import { ListSchoolYearsController } from './controllers/list-school-years-controller'
import { ListStudentsController } from './controllers/list-students-controller'
import { ListTuitionFeesController } from './controllers/list-tuition-fees-controller'
import { logoutUser } from './controllers/logout-controller'
import { openCashRegisterController } from './controllers/open-cash-register-controller'
import { openWorkShiftController } from './controllers/open-work-shift-controller'
import { RegisterEnrollmentPaymentController } from './controllers/register-enrollment-payment-controller'
import { registerUser } from './controllers/register-user-controller'
import { StartGamingSessionController } from './controllers/start-gaming-session-controller'
import { UpdateCompanyController } from './controllers/update-company-controller'
import { updateCurrentUserPasswordController } from './controllers/update-current-user-password-controller'
import { UpdateCustomerController } from './controllers/update-customer-controller'
import { UpdateEnrollmentController } from './controllers/update-enrollment-controller'
import { UpdateGamingConsoleController } from './controllers/update-gaming-console-controller'
import { UpdateGamingCustomerController } from './controllers/update-gaming-customer-controller'
import { UpdateGamingGameController } from './controllers/update-gaming-game-controller'
import { UpdateProductController } from './controllers/update-product-controller'
import { updateSaleStatusController } from './controllers/update-sale-status-controller'
import { UpdateStudentController } from './controllers/update-student-controller'
import { uploadCompanyLogoController } from './controllers/upload-company-logo-controller'
import { VerifyCompanyAccessPasscodeController } from './controllers/verify-company-access-passcode-controller'

export function appRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  type UntypedHandler = (this: unknown, ...args: unknown[]) => unknown

  function withPermission(operation: string): RouteShorthandOptions
  function withPermission<T>(operation: string, handler: T): T
  function withPermission(
    operation: string,
    handler?: unknown,
  ): RouteShorthandOptions | unknown {
    const guard = verifyRole(operation)
    if (!handler) {
      return { preHandler: guard }
    }

    const typedHandler = handler as UntypedHandler
    const wrapped = async function (
      this: unknown,
      request: FastifyRequest,
      reply: FastifyReply,
    ) {
      await guard(request, reply)
      if (reply.sent) {
        return
      }

      return typedHandler.call(this, request, reply)
    }

    return wrapped
  }

  function withAdmin<T>(handler: T): T {
    const typedHandler = handler as UntypedHandler
    const wrapped = async function (
      this: unknown,
      request: FastifyRequest,
      reply: FastifyReply,
    ) {
      await verifyAdmin(request, reply)
      if (reply.sent) {
        return
      }

      return typedHandler.call(this, request, reply)
    }

    return wrapped as unknown as T
  }

  const adminOnly: RouteShorthandOptions = { preHandler: verifyAdmin }

  app.post(
    '/auth/users',
    withPermission('auth:create-user', createManagedUserController),
  )
  app.patch('/me/password', updateCurrentUserPasswordController)

  app.post('/companies/:ownerId', withAdmin(CreateCompany))
  app.get('/companies/:companyId', withAdmin(FindCompanyById))
  app.patch('/companies/:companyId', withAdmin(UpdateCompanyController))
  app.post(
    '/companies/:companyId/access-passcode/verify',
    adminOnly,
    VerifyCompanyAccessPasscodeController,
  )
  app.patch(
    '/companies/:companyId/logo',
    withAdmin(uploadCompanyLogoController),
  )
  app.get('/companies/:companyId/logo', withAdmin(getCompanyLogoController))
  app.get(
    '/companies/:companyId/dashboard',
    adminOnly,
    getCompanyDashboardMetricsController,
  )
  app.get('/companies/owner/:ownerId', withAdmin(FindCompaniesByOwnerId))

  app.get('/owner/:ownerId/company', withAdmin(FindOneCompanyByOwnerId))
  app.post('/logout', withAdmin(logoutUser))

  app.get(
    '/business-units/company/:companyId',
    withAdmin(GetBusinessUnitsByCompanyIdController),
  )

  app.get(
    '/business-units/:businessUnitId',
    withPermission('business-units:read', GetBusinessUnitByIdController),
  )
  app.get(
    '/business-units/:businessUnitId/dashboard',
    withPermission('dashboard:read', getDashboardMetricsController),
  )

  app.get('/provinces', withPermission('provinces:read', GetAllProvinces))
  app.get(
    '/provinces/:provinceId/municipalities',
    withPermission('provinces:read'),
    GetMunicipalitiesByProvinceId,
  )

  app.get(
    '/inventory/products',
    withPermission('inventory:products:read', ListProductsController),
  )
  app.get(
    '/inventory/products/:productId',
    withPermission('inventory:products:read', GetProductByIdController),
  )
  app.get(
    '/inventory/categories',
    withPermission('inventory:categories:read', ListCategoriesController),
  )
  app.post(
    '/inventory/categories',
    withPermission('inventory:categories:create', CreateCategoryController),
  )
  app.post(
    '/inventory/products',
    withPermission('inventory:products:create', CreateProductController),
  )
  app.patch(
    '/inventory/products/:productId',
    withPermission('inventory:products:update', UpdateProductController),
  )
  app.delete(
    '/inventory/products/:productId',
    withPermission('inventory:products:delete', DeleteProductController),
  )

  app.get(
    '/customers',
    withPermission('customers:read', ListCustomersController),
  )
  app.get(
    '/customers/:id',
    withPermission('customers:read', FindCustomerByIdController),
  )
  app.post(
    '/customers',
    withPermission('customers:create', CreateCustomerController),
  )
  app.patch(
    '/customers/:id',
    withPermission('customers:update', UpdateCustomerController),
  )
  app.delete(
    '/customers/:id',
    withPermission('customers:delete', DeleteCustomerController),
  )

  app.get(
    '/business-units/:businessUnitId/students',
    withPermission('students:read', ListStudentsController),
  )
  app.get(
    '/business-units/:businessUnitId/students/:id',
    withPermission('students:read'),
    FindStudentByIdController,
  )
  app.post(
    '/business-units/:businessUnitId/students',
    withPermission('students:create', CreateStudentController),
  )
  app.patch(
    '/business-units/:businessUnitId/students/:id',
    withPermission('students:update'),
    UpdateStudentController,
  )
  app.delete(
    '/business-units/:businessUnitId/students/:id',
    withPermission('students:delete'),
    DeleteStudentController,
  )

  app.get(
    '/business-units/:businessUnitId/gaming-house/customers',
    withPermission('gaming-house:read'),
    ListGamingCustomersController,
  )
  app.post(
    '/business-units/:businessUnitId/gaming-house/customers',
    withPermission('gaming-house:create'),
    CreateGamingCustomerController,
  )
  app.patch(
    '/business-units/:businessUnitId/gaming-house/customers/:id',
    withPermission('gaming-house:update'),
    UpdateGamingCustomerController,
  )
  app.delete(
    '/business-units/:businessUnitId/gaming-house/customers/:id',
    withPermission('gaming-house:delete'),
    DeleteGamingCustomerController,
  )

  app.get(
    '/business-units/:businessUnitId/gaming-house/consoles',
    withPermission('gaming-house:read'),
    ListGamingConsolesController,
  )
  app.post(
    '/business-units/:businessUnitId/gaming-house/consoles',
    withPermission('gaming-house:create'),
    CreateGamingConsoleController,
  )
  app.patch(
    '/business-units/:businessUnitId/gaming-house/consoles/:id',
    withPermission('gaming-house:update'),
    UpdateGamingConsoleController,
  )
  app.delete(
    '/business-units/:businessUnitId/gaming-house/consoles/:id',
    withPermission('gaming-house:delete'),
    DeleteGamingConsoleController,
  )

  app.get(
    '/business-units/:businessUnitId/gaming-house/games',
    withPermission('gaming-house:read'),
    ListGamingGamesController,
  )
  app.post(
    '/business-units/:businessUnitId/gaming-house/games',
    withPermission('gaming-house:create'),
    CreateGamingGameController,
  )
  app.patch(
    '/business-units/:businessUnitId/gaming-house/games/:id',
    withPermission('gaming-house:update'),
    UpdateGamingGameController,
  )
  app.delete(
    '/business-units/:businessUnitId/gaming-house/games/:id',
    withPermission('gaming-house:delete'),
    DeleteGamingGameController,
  )

  app.post(
    '/business-units/:businessUnitId/gaming-house/sessions/start',
    withPermission('gaming-house:create'),
    StartGamingSessionController,
  )
  app.post(
    '/gaming-house/sessions/:sessionId/end',
    withPermission('gaming-house:create', EndGamingSessionController),
  )
  app.get(
    '/business-units/:businessUnitId/gaming-house/sessions',
    withPermission('gaming-house:read'),
    ListGamingSessionsController,
  )
  app.post(
    '/gaming-house/sessions/:sessionId/payments',
    withPermission('gaming-house:payments:create'),
    CreateGamingSessionPaymentController,
  )
  app.get(
    '/gaming-house/sessions/:sessionId/payments',
    withPermission('gaming-house:payments:read'),
    ListGamingSessionPaymentsController,
  )

  app.post(
    '/business-units/:businessUnitId/gaming-house/expenses',
    withPermission('gaming-house:create'),
    CreateGamingExpenseController,
  )
  app.get(
    '/business-units/:businessUnitId/gaming-house/expenses',
    withPermission('gaming-house:read'),
    ListGamingExpensesController,
  )

  app.post(
    '/business-units/:businessUnitId/gaming-house/tournaments',
    withPermission('gaming-house:create'),
    CreateGamingTournamentController,
  )
  app.get(
    '/business-units/:businessUnitId/gaming-house/tournaments',
    withPermission('gaming-house:read'),
    ListGamingTournamentsController,
  )
  app.get(
    '/business-units/:businessUnitId/gaming-house/reports/revenue',
    withPermission('gaming-house:reports:read'),
    GetGamingReportsController,
  )

  app.get('/academy/belts', withPermission('academy:read', ListBeltsController))
  app.post(
    '/academy/belts',
    withPermission('academy:create', CreateBeltController),
  )

  app.get(
    '/academy/tuition-fees',
    withPermission('academy:read', ListTuitionFeesController),
  )
  app.post(
    '/academy/tuition-fees',
    withPermission('academy:create', CreateTuitionFeeController),
  )

  app.get(
    '/academy/school-years',
    withPermission('academy:read', ListSchoolYearsController),
  )
  app.post(
    '/academy/school-years',
    withPermission('academy:create', CreateSchoolYearController),
  )

  app.get(
    '/academy/instructors',
    withPermission('academy:read', ListInstructorsController),
  )
  app.post(
    '/academy/instructors',
    withPermission('academy:create', CreateInstructorController),
  )

  app.get(
    '/business-units/:businessUnitId/classes',
    withAdmin(ListClassesController),
  )
  app.post('/academy/classes', withAdmin(CreateClassController))

  app.get(
    '/business-units/:businessUnitId/enrollments',
    withPermission('enrollments:read'),
    ListEnrollmentsController,
  )
  app.post(
    '/business-units/:businessUnitId/enrollments',
    withPermission('enrollments:create'),
    CreateEnrollmentController,
  )
  app.patch(
    '/business-units/:businessUnitId/enrollments/:id',
    withPermission('enrollments:update'),
    UpdateEnrollmentController,
  )
  app.delete(
    '/business-units/:businessUnitId/enrollments/:id',
    withPermission('enrollments:delete'),
    DeleteEnrollmentController,
  )
  app.get(
    '/business-units/:businessUnitId/enrollments/:id/report/pdf',
    withPermission('enrollments:read-pdf'),
    exportEnrollmentPdfController,
  )
  app.post(
    '/business-units/:businessUnitId/enrollments/:id/payments',
    withPermission('enrollments:register-payment'),
    RegisterEnrollmentPaymentController,
  )
  app.get(
    '/business-units/:businessUnitId/enrollments/:id/financial-plans',
    withPermission('enrollments:read-financial-plans'),
    ListEnrollmentFinancialPlansController,
  )
  app.get(
    '/business-units/:businessUnitId/payments/recent',
    withPermission('enrollments:read'),
    ListRecentEnrollmentPaymentsController,
  )

  // Sales/Invoice routes
  app.post('/sales', withPermission('sales:create', createSaleController))
  app.get('/sales', withPermission('sales:read', listSalesController))
  app.get('/sales/:id', withPermission('sales:read', getSaleController))
  app.get(
    '/sales/:id/report/pdf',
    withPermission('sales:read-pdf', exportInvoicePdfController),
  )
  app.patch(
    '/sales/:id/status',
    withPermission('sales:update-status', updateSaleStatusController),
  )

  // Cash flow routes
  app.post(
    '/cash-registers/open',
    withPermission('cash-registers:open', openCashRegisterController),
  )
  app.get(
    '/cash-registers/business-unit/:businessUnitId/open',
    withPermission('cash-registers:read-open'),
    getOpenCashRegisterController,
  )
  app.post(
    '/cash-registers/:cashRegisterId/close',
    withPermission('cash-registers:close', closeCashRegisterController),
  )
  app.post(
    '/work-shifts/open',
    withPermission('work-shifts:open', openWorkShiftController),
  )
  app.get(
    '/work-shifts/cash-register/:cashRegisterId/open',
    withPermission('work-shifts:read-open'),
    getOpenWorkShiftController,
  )
  app.post(
    '/work-shifts/:workShiftId/close',
    withPermission('work-shifts:close', closeWorkShiftController),
  )
  app.post(
    '/cash-movements',
    withPermission('cash-movements:create', createCashMovementController),
  )
  app.get(
    '/cash-movements',
    withPermission('cash-movements:read', listCashMovementsController),
  )
}

export function nonAuthenticatedRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }))
  app.get('/updates/:platform/channel', getAppUpdateAssetController)
  app.get('/updates/:platform/:assetName', getAppUpdateAssetController)

  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)
}
