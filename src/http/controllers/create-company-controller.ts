import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { Regime } from '@/use-cases/create-company-use-case'
import { CompanyAlreadyExistsError } from '@/use-cases/errors/company-already-exists-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MakeCreateCompanyUseCase } from '@/use-cases/factory/make-create-company-use-case'

export async function CreateCompany(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCompanyBodySchema = z.object({
    name: z.string(),
    nif: z.string().trim().min(9),
    social_reason: z.string(),
    registration_number: z.string(),
    document_code: z.string(),
    email: z.email().trim(),
    phone_number: z.string().trim().min(9),
    street: z.string(),
    user_owner_id: z.string(),
    municipality_id: z.string(),
    website: z.url().optional(),
    regime: z.enum(Regime).default(Regime.SIMPLIFICADO),
    social_capital: z.number().optional(),
    zip_code: z.string().optional(),
  })

  const createCompanyParamsSchema = z.object({
    ownerId: z.uuid(),
  })

  const { ownerId } = createCompanyParamsSchema.parse(request.params)
  const companyData = createCompanyBodySchema.parse(request.body)

  try {
    const createCompanyUseCase = MakeCreateCompanyUseCase()

    await createCompanyUseCase.execute({
      ...companyData,
      user_owner_id: ownerId,
    })
  } catch (err) {
    if (err instanceof CompanyAlreadyExistsError) {
      reply.status(409).send({ message: err.message })
    } else if (err instanceof z.ZodError) {
      reply.status(400).send({ message: 'Invalid request data' })
    } else if (err instanceof ResourceNotFoundError) {
      reply.status(403).send({ message: err.message })
    }

    throw err
  }

  reply.status(201).send()
}
