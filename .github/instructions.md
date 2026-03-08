# Copilot Instructions for kommerce-api

## Project Overview

**kommerce-api** is the backend server for the Kommerce ERP system, built with **Fastify** + **TypeScript** + **Prisma** + **Node.js**. The project follows clean architecture principles with clear separation between HTTP handlers (controllers), business logic (use-cases), and data access (repositories). All components are type-safe and use composition with dependency injection via factory functions.

---

## Architecture & Project Organization

### Folder Structure

```
src/
├── http/
│   ├── controllers/          # Request handlers (HTTP layer)
│   │   ├── create-customer-controller.ts
│   │   ├── find-customer-controller.ts
│   │   └── list-customers-controller.ts
│   ├── schemas/              # Zod validation schemas for request bodies
│   │   ├── create-customer-schema.ts
│   │   └── [resource]-schema.ts
│   └── route.ts              # Route definitions
├── use-cases/
│   ├── factory/              # Dependency injection factories
│   │   ├── make-create-customer-use-case.ts
│   │   ├── make-list-customers-use-case.ts
│   │   └── [make-use-case].ts
│   ├── errors/               # Custom error classes
│   │   ├── resource-not-found-error.ts
│   │   ├── invalid-credentials-error.ts
│   │   └── [error-type].ts
│   └── [business-domain]/
│       ├── create-customer-use-case.ts
│       ├── list-customers-use-case.ts
│       └── [use-case].ts
├── repositories/
│   ├── [resource]-repository.ts      # Interface definitions
│   ├── factories/
│   │   └── [resource]-repository-factory.ts
│   └── prisma/
│       └── prisma-[resource]-repository.ts  # Prisma implementations
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── [library].ts          # Other library configurations
├── middlewares/
│   ├── verify-jwt.ts         # JWT authentication middleware
│   └── [middleware].ts       # Other middleware
├── db/                       # Database migrations and seed
├── env/                      # Environment configuration with Zod validation
│   └── index.ts
├── utils/
│   ├── handle-controller-error.ts  # Centralized error handler
│   └── [utility].ts
├── config/
│   └── swagger.ts            # Swagger API documentation
├── app.ts                    # Fastify app configuration
└── server.ts                 # Server startup
```

### Design Philosophy

- **Clean Architecture**: Clear separation between HTTP (controllers), business logic (use-cases), and data access (repositories)
- **Dependency Injection**: All dependencies are injected via factory functions, making code testable
- **Error Handling**: Custom error classes with centralized error translation in controllers
- **Validation**: Request validation with Zod before reaching use-cases
- **Type Safety**: Strong TypeScript throughout, explicit types, no `any`
- **Reusability**: Use-cases and repositories are independent of HTTP framework

---

## Naming Conventions

| Category | Convention | Examples |
|----------|-----------|----------|
| **Controller Functions** | `PascalCase` + `Controller` suffix | `CreateCustomerController`, `ListCustomersController`, `FindCompanyByIdController` |
| **Controller Files** | `kebab-case-controller.ts` | `create-customer-controller.ts`, `list-companies-controller.ts` |
| **Use-Case Classes** | `PascalCase` + `UseCase` suffix | `CreateCustomerUseCase`, `ListCustomersUseCase`, `FindCustomerByIdUseCase` |
| **Use-Case Files** | `kebab-case-use-case.ts` | `create-customer-use-case.ts`, `list-customers-use-case.ts` |
| **Factory Functions** | `Make` + `PascalCase` + `UseCase` | `MakeCreateCustomerUseCase()`, `MakeListCustomersUseCase()` |
| **Repository Interfaces** | `PascalCase` + `Repository` suffix | `CustomersRepository`, `CompaniesRepository` |
| **Repository Files** | `kebab-case-repository.ts` (interface) | `customers-repository.ts`, `companies-repository.ts` |
| **Prisma Repo Implementation** | `Prisma` + `PascalCase` + `Repository` | `PrismaCustomersRepository`, `PrismaCompaniesRepository` |
| **Prisma Repo Files** | `prisma-kebab-case-repository.ts` | `prisma-customers-repository.ts` |
| **Error Classes** | `PascalCase` + `Error` suffix | `ResourceNotFoundError`, `InvalidCredentialsError`, `ValidationError` |
| **Error Files** | `kebab-case-error.ts` | `resource-not-found-error.ts`, `invalid-credentials-error.ts` |
| **Zod Schemas** | `camelCase` + `Schema` suffix | `createCustomerSchema`, `loginSchema`, `updateCompanySchema` |
| **Schema Files** | `kebab-case-schema.ts` | `create-customer-schema.ts`, `login-schema.ts` |
| **Middleware Functions** | `camelCase` or `PascalCase` | `verifyJwt`, `ValidateRequest` |
| **Route Files** | `route.ts` (single file) or `routes/[domain]-routes.ts` | `route.ts`, `customer-routes.ts` |
| **Variables & Functions** | `camelCase` | `customerId`, `getUserById()`, `validateInput()` |
| **Constants** | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE`, `MAX_RETRIES`, `JWT_EXPIRY` |

---

## Core Patterns

### 1. Controller Pattern (HTTP Layer)

Controllers are **async functions** that:
1. Validate input with Zod
2. Instantiate use-case via factory
3. Execute business logic
4. Handle errors consistently
5. Return structured response

```tsx
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MakeCreateCustomerUseCase } from '@/use-cases/factory/make-create-customer-use-case'
import { createCustomerSchema } from '@/http/schemas/create-customer-schema'
import { handleControllerError } from '@/utils/handle-controller-error'

export async function CreateCustomerController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // 1. Validate input
  const { name, email, phone, documentNumber, municipalityId } = 
    createCustomerSchema.parse(request.body)

  try {
    // 2. Instantiate use-case
    const createCustomerUseCase = MakeCreateCustomerUseCase()

    // 3. Execute business logic
    const { customer } = await createCustomerUseCase.execute({
      name,
      email: email || null,
      phone: phone || null,
      documentNumber,
      municipalityId
    })

    // 4. Return success response
    return reply.status(201).send(customer)
  } catch (err) {
    // 5. Handle errors
    if (handleControllerError(reply, err)) {
      return
    }
    throw err
  }
}
```

**Key Rules:**
- Always have explicit function signature with `FastifyRequest` and `FastifyReply` types
- Keep controllers **thin** — validate and delegate to use-case
- Always wrap use-case execution in try-catch
- Always call `handleControllerError()` in catch block
- Return `void` (Fastify handles response via `reply`)
- Use `reply.status(code).send(data)` for responses
- For POST, use `.status(201)` for creation

### 2. Zod Validation Schema Pattern

Define request schemas in `http/schemas/`:

```tsx
// http/schemas/create-customer-schema.ts
import { z } from 'zod'

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name cannot exceed 255 characters'),
  
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .transform((val) => val || null),
  
  phone: z
    .string()
    .regex(/^\d{10,}$/, 'Phone must be at least 10 digits')
    .optional()
    .transform((val) => val || null),
  
  documentNumber: z
    .string()
    .min(11, 'Document number must be at least 11 characters')
    .max(14, 'Document number cannot exceed 14 characters'),
  
  municipalityId: z.string().uuid('Invalid municipality ID')
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
```

**Key Rules:**
- Use `.min()`, `.max()`, `.regex()` for validation
- Provide clear error messages matching user language
- Use `.transform()` to normalize data (e.g., empty string to null)
- Export both schema and inferred type
- Place schemas in `http/schemas/` folder
- Use descriptive schema names matching controller intent

### 3. Use-Case Pattern (Business Logic)

Use-cases encapsulate business logic with dependency injection:

```tsx
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import type { CustomersRepository } from '@/repositories/customers-repository'
import type { CustomerData } from '@/repositories/customers-repository'

export interface CreateCustomerInput {
  name: string
  email: string | null
  phone: string | null
  documentNumber: string
  municipalityId: string
}

export interface CreateCustomerOutput {
  customer: CustomerData
}

export class CreateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(input: CreateCustomerInput): Promise<CreateCustomerOutput> {
    // Business logic
    const customer = await this.customersRepository.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      documentNumber: input.documentNumber,
      municipalityId: input.municipalityId
    })

    return { customer }
  }
}
```

**Complex Use-Case with Multiple Dependencies:**

```tsx
export class CreateCompanyUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
    private businessUnitRepository: BusinessUnitRepository
  ) {}

  async execute(input: CreateCompanyInput): Promise<CreateCompanyOutput> {
    // Check user exists
    const user = await this.usersRepository.findById(input.userId)
    if (!user) {
      throw new ResourceNotFoundError('User not found')
    }

    // Check business unit exists
    const businessUnit = await this.businessUnitRepository.findById(input.businessUnitId)
    if (!businessUnit) {
      throw new ResourceNotFoundError('Business unit not found')
    }

    // Create company
    const company = await this.companiesRepository.create({
      name: input.name,
      documentCode: input.documentCode,
      userId: input.userId,
      businessUnitId: input.businessUnitId
    })

    return { company }
  }
}
```

**Key Rules:**
- Accept dependencies via constructor
- Use `async/await` for asynchronous operations
- Throw custom errors for business rule violations
- Keep use-cases focused on single responsibility
- Define Input and Output types
- Export use-case class as default or named export
- Never directly access HTTP request/response objects
- No knowledge of database (use repositories)

### 4. Factory Pattern (Dependency Injection)

Factories instantiate use-cases with all dependencies:

```tsx
// use-cases/factory/make-create-customer-use-case.ts
import { PrismaCustomersRepository } from '@/repositories/prisma/prisma-customers-repository'
import { CreateCustomerUseCase } from '@/use-cases/customers/create-customer-use-case'

export function MakeCreateCustomerUseCase(): CreateCustomerUseCase {
  const customersRepository = new PrismaCustomersRepository()
  const useCase = new CreateCustomerUseCase(customersRepository)
  return useCase
}
```

**For Complex Use-Cases:**

```tsx
// use-cases/factory/make-create-company-use-case.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaCompaniesRepository } from '@/repositories/prisma/prisma-companies-repository'
import { PrismaBusinessUnitRepository } from '@/repositories/prisma/prisma-business-unit-repository'
import { CreateCompanyUseCase } from '@/use-cases/companies/create-company-use-case'

export function MakeCreateCompanyUseCase(): CreateCompanyUseCase {
  const usersRepository = new PrismaUsersRepository()
  const companiesRepository = new PrismaCompaniesRepository()
  const businessUnitRepository = new PrismaBusinessUnitRepository()
  
  const useCase = new CreateCompanyUseCase(
    usersRepository,
    companiesRepository,
    businessUnitRepository
  )
  
  return useCase
}
```

**Key Rules:**
- Create one factory function per use-case
- Name factory with `Make` + use-case class name
- Instantiate all dependencies in factory
- Return fully constructed use-case
- Place factories in `use-cases/factory/` folder
- Keep factories simple—just instantiation
- Don't add logic to factories

### 5. Repository Pattern (Data Access)

**Interface (Contract):**

```tsx
// repositories/customers-repository.ts
export interface CustomerData {
  id: string
  name: string
  email: string | null
  phone: string | null
  documentNumber: string
  municipalityId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCustomerInput {
  name: string
  email: string | null
  phone: string | null
  documentNumber: string
  municipalityId: string
}

export interface CustomersRepository {
  create(input: CreateCustomerInput): Promise<CustomerData>
  findById(id: string): Promise<CustomerData | null>
  findByDocumentNumber(documentNumber: string): Promise<CustomerData | null>
  findAll(): Promise<CustomerData[]>
  update(id: string, input: Partial<CreateCustomerInput>): Promise<CustomerData>
  delete(id: string): Promise<void>
}
```

**Implementation (Prisma):**

```tsx
// repositories/prisma/prisma-customers-repository.ts
import { prisma } from '@/lib/prisma'
import type { CustomerData, CreateCustomerInput, CustomersRepository } from '@/repositories/customers-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class PrismaCustomersRepository implements CustomersRepository {
  async create(input: CreateCustomerInput): Promise<CustomerData> {
    const customer = await prisma.customer.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        documentNumber: input.documentNumber,
        municipalityId: input.municipalityId
      },
      include: {
        municipality: true
      }
    })

    return this.toCustomerData(customer)
  }

  async findById(id: string): Promise<CustomerData | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { municipality: true }
    })

    return customer ? this.toCustomerData(customer) : null
  }

  async findByDocumentNumber(documentNumber: string): Promise<CustomerData | null> {
    const customer = await prisma.customer.findUnique({
      where: { documentNumber },
      include: { municipality: true }
    })

    return customer ? this.toCustomerData(customer) : null
  }

  async findAll(): Promise<CustomerData[]> {
    const customers = await prisma.customer.findMany({
      include: { municipality: true },
      orderBy: { createdAt: 'desc' }
    })

    return customers.map((customer) => this.toCustomerData(customer))
  }

  async update(id: string, input: Partial<CreateCustomerInput>): Promise<CustomerData> {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        documentNumber: input.documentNumber,
        municipalityId: input.municipalityId
      },
      include: { municipality: true }
    })

    return this.toCustomerData(customer)
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id }
    })
  }

  private toCustomerData(raw: any): CustomerData {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      documentNumber: raw.documentNumber,
      municipalityId: raw.municipalityId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    }
  }
}
```

**Key Rules:**
- Define repository interface with clear contracts
- Separate interface files from implementations
- Use `toXXXData()` private method to transform database models to domain models
- Always include necessary relations with `.include()`
- Order results consistently (usually by `createdAt: 'desc'`)
- Throw custom errors for not-found cases if needed
- Never leak Prisma models—always transform to domain types
- Implement all interface methods

### 6. Custom Error Classes

Create custom errors in `use-cases/errors/`:

```tsx
// use-cases/errors/resource-not-found-error.ts
export class ResourceNotFoundError extends Error {
  constructor(message: string = 'Resource not found.') {
    super(message)
    this.name = 'ResourceNotFoundError'
  }
}

// use-cases/errors/invalid-credentials-error.ts
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password.')
    this.name = 'InvalidCredentialsError'
  }
}

// use-cases/errors/duplicate-entry-error.ts
export class DuplicateEntryError extends Error {
  constructor(field: string) {
    super(`A resource with this ${field} already exists.`)
    this.name = 'DuplicateEntryError'
  }
}

// use-cases/errors/validation-error.ts
export class ValidationError extends Error {
  constructor(public readonly field: string, message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// use-cases/errors/cash-balance-mismatch-error.ts
export class CashBalanceMismatchError extends Error {
  constructor() {
    super('Closing balance does not match expected balance.')
    this.name = 'CashBalanceMismatchError'
  }
}
```

**Key Rules:**
- Extend native `Error` class
- Set `this.name` property for identification
- Constructor should accept message parameter
- Keep error names descriptive and specific
- Throw errors in use-cases, not repositories
- Use errors for business logic violations

### 7. Centralized Error Handling

Handle all errors consistently in controllers:

```tsx
// utils/handle-controller-error.ts
import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { DuplicateEntryError } from '@/use-cases/errors/duplicate-entry-error'
import { ValidationError } from '@/use-cases/errors/validation-error'
import { CashBalanceMismatchError } from '@/use-cases/errors/cash-balance-mismatch-error'

export const handleControllerError = (
  reply: FastifyReply,
  err: unknown,
): boolean => {
  // Validation errors from Zod
  if (err instanceof ZodError) {
    reply.status(400).send({
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    })
    return true
  }

  // Not found errors
  if (err instanceof ResourceNotFoundError) {
    reply.status(404).send({
      message: err.message
    })
    return true
  }

  // Authentication errors
  if (err instanceof InvalidCredentialsError) {
    reply.status(401).send({
      message: err.message
    })
    return true
  }

  // Duplicate entry errors
  if (err instanceof DuplicateEntryError) {
    reply.status(409).send({
      message: err.message
    })
    return true
  }

  // Validation errors from use-case
  if (err instanceof ValidationError) {
    reply.status(400).send({
      message: 'Validation error',
      field: err.field,
      error: err.message
    })
    return true
  }

  // Business logic errors
  if (err instanceof CashBalanceMismatchError) {
    reply.status(400).send({
      message: err.message
    })
    return true
  }

  // Unknown errors
  return false
}
```

**Key Rules:**
- Centralize error translation in `utils/handle-controller-error.ts`
- Return `true` if error handled, `false` if should be thrown
- Use appropriate HTTP status codes (400, 401, 404, 409)
- Always include `message` field in response
- For validation errors, include field-specific information
- If error not handled, re-throw to trigger global error handler

### 8. Route Registration

Define routes in single `route.ts` file:

```tsx
// http/route.ts
import { FastifyInstance } from 'fastify'

// Controllers
import { CreateCustomerController } from '@/http/controllers/create-customer-controller'
import { ListCustomersController } from '@/http/controllers/list-customers-controller'
import { FindCustomerController } from '@/http/controllers/find-customer-controller'
import { UpdateCustomerController } from '@/http/controllers/update-customer-controller'
import { DeleteCustomerController } from '@/http/controllers/delete-customer-controller'

// Middleware
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance): Promise<void> {
  // Public routes
  app.post('/customers', CreateCustomerController)

  // Protected routes (require JWT)
  app.get(
    '/customers',
    { onRequest: [verifyJwt] },
    ListCustomersController
  )

  app.get(
    '/customers/:id',
    { onRequest: [verifyJwt] },
    FindCustomerController
  )

  app.patch(
    '/customers/:id',
    { onRequest: [verifyJwt] },
    UpdateCustomerController
  )

  app.delete(
    '/customers/:id',
    { onRequest: [verifyJwt] },
    DeleteCustomerController
  )
}
```

**Key Rules:**
- Keep all routes in single `http/route.ts` file
- Group routes by resource (all customer routes together)
- Apply middleware using `{ onRequest: [middleware] }`
- Use RESTful conventions (GET, POST, PATCH, DELETE)
- Use path parameters for resource IDs (`:id`)
- Register route function in `app.ts`

### 9. Environment Configuration

Validate environment variables at startup:

```tsx
// env/index.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z
    .enum(['dev', 'production', 'test'])
    .default('dev'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3333'),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('Invalid environment variables: ')
  console.log(_env.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const env = _env.data
```

**Key Rules:**
- Validate all environment variables at application startup
- Use Zod for validation and type inference
- Throw error if validation fails
- Export typed `env` object
- Provide sensible defaults where appropriate
- Never access `process.env` directly—use `env` object

### 10. Fastify App Configuration

Configure app with middleware, plugins, and routes:

```tsx
// app.ts
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { env } from '@/env'
import { appRoutes } from '@/http/route'

export const app = fastify({
  logger: {
    level: env.LOG_LEVEL
  }
})

// Register plugins
app.register(cors, {
  origin: env.NODE_ENV === 'production' ? [] : env.CORS_ORIGIN,
  credentials: true
})

app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'accessToken',
    signed: true
  },
  sign: {
    expiresIn: '7d'
  }
})

// Register routes
app.register(appRoutes)

// Global error handler
app.setErrorHandler((error, request, reply) => {
  console.error(error)
  reply.status(500).send({
    message: 'Internal server error'
  })
})
```

**Key Rules:**
- Configure all plugins/middleware in `app.ts`
- Register routes with `app.register(appRoutes)`
- Set up global error handler
- Use environment variables for configuration
- Enable logging with proper levels
- Handle CORS appropriately based on environment

---

## File Structure Guide

### Creating a New Resource Module

1. **Create Zod schema** in `http/schemas/[resource]-schema.ts`
2. **Create repository interface** in `repositories/[resource]-repository.ts`
3. **Create Prisma implementation** in `repositories/prisma/prisma-[resource]-repository.ts`
4. **Create use-cases** in `use-cases/[domain]/[action]-[resource]-use-case.ts`
5. **Create factories** in `use-cases/factory/make-[action]-[resource]-use-case.ts`
6. **Create controllers** in `http/controllers/[action]-[resource]-controller.ts`
7. **Register routes** in `http/route.ts`

### Example: Adding Complete Customer Module

```
http/
  schemas/
    create-customer-schema.ts
  controllers/
    create-customer-controller.ts
    list-customers-controller.ts
    find-customer-controller.ts
    update-customer-controller.ts
    delete-customer-controller.ts

use-cases/
  factory/
    make-create-customer-use-case.ts
    make-list-customers-use-case.ts
    make-find-customer-use-case.ts
    make-update-customer-use-case.ts
    make-delete-customer-use-case.ts
  customers/
    create-customer-use-case.ts
    list-customers-use-case.ts
    find-customer-use-case.ts
    update-customer-use-case.ts
    delete-customer-use-case.ts

repositories/
  customers-repository.ts
  prisma/
    prisma-customers-repository.ts
```

---

## Do's and Don'ts

### ✅ DO's

- Always validate input with Zod schemas before use-case execution
- Always use factories to instantiate use-cases in controllers
- Always handle errors consistently using `handleControllerError()`
- Always define repository interfaces before implementations
- Always inject dependencies via constructor (dependency injection)
- Always use custom error classes for business rule violations
- Always type request/response with Zod
- Always keep controllers thin and focused on HTTP concerns
- Always test use-cases independently (no HTTP dependency)
- Always use descriptive error messages for users
- Always transform database models to domain models in repositories
- Always use `async/await` instead of `.then()` chains

### ❌ DON'ts

- Don't use `any` type—be specific with types
- Don't mix business logic with HTTP logic in controllers
- Don't access `process.env` directly—use typed `env` object
- Don't call database directly from controllers—use repositories
- Don't hardcode configuration values—use environment variables
- Don't mix multiple error handling approaches
- Don't forget to throw custom errors in use-cases
- Don't return Prisma models from repositories—transform them
- Don't skip request validation
- Don't create circular dependencies between modules
- Don't use default exports for classes/functions
- Don't hardcode HTTP status codes—document error mapping

---

## Common Tasks

### Add a New CRUD Resource

**1. Create Zod schema:**

```tsx
// http/schemas/create-product-schema.ts
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be positive'),
  categoryId: z.string().uuid()
})

export type CreateProductInput = z.infer<typeof createProductSchema>
```

**2. Create repository interface:**

```tsx
// repositories/products-repository.ts
export interface ProductData {
  id: string
  name: string
  sku: string
  price: number
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductsRepository {
  create(input: CreateProductInput): Promise<ProductData>
  findById(id: string): Promise<ProductData | null>
  findAll(): Promise<ProductData[]>
  update(id: string, input: Partial<CreateProductInput>): Promise<ProductData>
  delete(id: string): Promise<void>
}
```

**3. Implement with Prisma:**

```tsx
// repositories/prisma/prisma-products-repository.ts
export class PrismaProductsRepository implements ProductsRepository {
  // ... implementation
}
```

**4. Create use-cases:**

```tsx
export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(input: CreateProductInput): Promise<ProductData> {
    return this.productsRepository.create(input)
  }
}
```

**5. Create factory:**

```tsx
// use-cases/factory/make-create-product-use-case.ts
export function MakeCreateProductUseCase(): CreateProductUseCase {
  const repository = new PrismaProductsRepository()
  return new CreateProductUseCase(repository)
}
```

**6. Create controller:**

```tsx
// http/controllers/create-product-controller.ts
export async function CreateProductController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const input = createProductSchema.parse(request.body)

  try {
    const useCase = MakeCreateProductUseCase()
    const product = await useCase.execute(input)
    return reply.status(201).send(product)
  } catch (err) {
    if (handleControllerError(reply, err)) {
      return
    }
    throw err
  }
}
```

**7. Register route:**

```tsx
// http/route.ts
app.post('/products', CreateProductController)
```

---

## Testing Considerations

Use-cases are highly testable since they're independent of HTTP:

```tsx
// tests/use-cases/create-product-use-case.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { CreateProductUseCase } from '@/use-cases/products/create-product-use-case'
import type { ProductsRepository } from '@/repositories/products-repository'

// Mock repository
class MockProductsRepository implements ProductsRepository {
  async create(input) {
    return {
      id: 'mock-id',
      ...input
    }
  }
  // ... other methods
}

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new MockProductsRepository()
    useCase = new CreateProductUseCase(repository)
  })

  it('should create a product', async () => {
    const result = await useCase.execute({
      name: 'Test Product',
      sku: '123',
      price: 99.99,
      categoryId: 'cat-1'
    })

    expect(result.id).toBeDefined()
    expect(result.name).toBe('Test Product')
  })
})
```

**Key Testing Rules:**
- Mock repositories for use-case tests
- Test use-cases in isolation
- Test controller error handling separately
- Don't test Prisma—test repository interface contracts
- Use descriptive test names matching user behavior

---

## Additional Resources

- Fastify Docs: https://www.fastify.io/
- Prisma ORM: https://www.prisma.io/
- Zod Validation: https://zod.dev
- TypeScript Best Practices: Use strict mode, explicit types
- Clean Architecture: Separate concerns, dependency injection, testability
