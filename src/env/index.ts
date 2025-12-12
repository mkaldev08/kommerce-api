import z, { string } from 'zod'

const envSchema = z.object({
  DATABASE_URL: string(),
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  POSTGRES_USER: string(),
  POSTGRES_PASSWORD: string(),
  POSTGRES_DATABASE: string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if(!_env.success) {
    console.log('Invalid environments variables: ', z.treeifyError(_env.error))
  throw new Error('Invalid environments variables')
}

export const env = _env.data
