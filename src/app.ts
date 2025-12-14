import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/route'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: 'Validation error.',
      issues: z.treeifyError(error),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here you can integrate with a logging service like Sentry, LogRocket, etc.
  }

  reply.status(500).send({ message: 'Internal server error.' })
})
