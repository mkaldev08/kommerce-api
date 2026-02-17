import { env } from '../env'

export const swaggerConfig = {
  swagger: {
    info: {
      title: 'Kommerce API',
      description:
        'API documentation for Kommerce - Commerce Management System',
      version: '1.0.0',
      contact: {
        name: 'Kommerce Support',
        email: 'pedrokalueca@gmail.com',
      },
    },
    host: env.NODE_ENV === 'production' ? 'api.kommerce.com' : 'localhost:3000',
    schemes: env.NODE_ENV === 'production' ? ['https'] : ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'cookie',
        description: 'Bearer token for API authentication',
      },
    },
  },
  uiConfig: {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  },
}
