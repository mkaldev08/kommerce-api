# API Documentation with Swagger

## Overview

The Kommerce API now includes comprehensive OpenAPI documentation powered by Swagger. This setup includes:

- **@fastify/swagger**: OpenAPI specification generation
- **@fastify/swagger-ui**: Interactive API documentation UI
- **Zod Integration**: Type-safe schema validation with automatic documentation

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:

```
http://localhost:3000/docs
```

The OpenAPI JSON specification is available at:

```
http://localhost:3000/docs/json
```

The OpenAPI YAML specification is available at:

```
http://localhost:3000/docs/yaml
```

## Features

### 1. Interactive API Testing
- Test all endpoints directly from the browser
- See real-time request/response examples
- Authentication token management for protected routes

### 2. Auto-Generated Documentation
- All routes are automatically documented
- Request/response schemas are generated from Zod schemas
- Parameter types and validation rules are included

### 3. Authentication Support
- Bearer token authentication configured
- Click "Authorize" button in Swagger UI
- Enter token in format: `Bearer your-token-here`

## Route Documentation

### Public Routes (No Authentication Required)

#### POST /api/v1/users
Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### POST /api/v1/sessions
Login to get authentication token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Protected Routes (Requires Bearer Token)

#### POST /api/v1/companies/:ownerId
Create a new company

#### GET /api/v1/companies/:companyId
Get company details by ID

#### GET /api/v1/companies/owner/:ownerId
Get all companies for a specific owner

#### GET /api/v1/owner/:ownerId/company
Get single company by owner ID

## Schema Validation

All endpoints use Zod schemas for validation. The schemas are defined in `/src/http/schemas.ts` and include:

- `registerUserSchema`: User registration validation
- `loginSchema`: Login credentials validation
- `createCompanySchema`: Company creation validation
- Response schemas for all endpoints
- Error response schemas

## Configuration

The Swagger configuration is located in `/src/config/swagger.ts`. You can customize:

- API title and description
- Contact information
- Host and schemes
- Security definitions

## Development

When adding new routes:

1. Define Zod schemas in `/src/http/schemas.ts`
2. Add route with schema in route definitions
3. Documentation is automatically generated

Example:
```typescript
app.post('/new-route', {
  schema: {
    tags: ['Category'],
    summary: 'Brief description',
    body: yourZodSchema,
    response: {
      200: responseSchema,
      400: errorSchema,
    },
    security: [{ bearerAuth: [] }], // if authentication required
  }
}, handler)
```

## Testing with Swagger UI

1. Start the server: `pnpm dev`
2. Navigate to http://localhost:3000/docs
3. For authenticated routes:
   - First register/login to get a token
   - Click "Authorize" button at top
   - Enter token as: `Bearer YOUR_TOKEN`
   - Now you can test protected endpoints

## Production Considerations

- Update the host configuration in `swagger.ts` for production domain
- Consider rate limiting for the docs endpoint
- Set up proper CORS policies
- Review and update security definitions

## Additional Resources

- [Fastify Swagger Documentation](https://github.com/fastify/fastify-swagger)
- [Fastify Swagger UI Documentation](https://github.com/fastify/fastify-swagger-ui)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Zod Documentation](https://zod.dev/)
