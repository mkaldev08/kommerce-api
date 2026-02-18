import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import { env } from './env'
import { appRoutes, nonAuthenticatedRoutes } from './http/route'
import { verifyJWT } from './middlewares/verify-jwt'

export const app = fastify({
  logger: env.NODE_ENV !== 'production',
})
const API_VERSION = '/api/v1'

app.register(cors, {
  origin: env.NODE_ENV === 'production' ? [] : 'http://localhost:5173',
  credentials: true,
})

app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'accessToken',
    signed: true,
  },
})

// // Register Swagger for OpenAPI documentation
// app.register(swagger, swaggerConfig.swagger)

// // Register Swagger UI
// app.register(swaggerUi, swaggerConfig.uiConfig)

app.register(appRoutes, { prefix: API_VERSION, preHandler: [verifyJWT] })
app.register(nonAuthenticatedRoutes, { prefix: API_VERSION })
