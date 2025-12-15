import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DATABASE: z.string().optional(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  //TODO: usar um outro log em producao
  console.log('Invalid environments variables: ', z.treeifyError(_env.error))
  throw new Error('Invalid environments variables')
}

export const env = _env.data
