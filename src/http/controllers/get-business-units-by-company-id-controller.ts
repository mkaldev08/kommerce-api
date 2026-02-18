import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeGetBusinessUnitsByCompanyIdUseCase } from '@/use-cases/factory/make-get-business-units-by-company-id-use-case'

export async function GetBusinessUnitsByCompanyIdController(
  request: FastifyRequest<{
    Params: {
      companyId: string
    }
  }>,
  reply: FastifyReply,
) {
  const { companyId } = request.params

  const getBusinessUnitsByCompanyIdUseCase =
    MakeGetBusinessUnitsByCompanyIdUseCase()

  const { businessUnits } = await getBusinessUnitsByCompanyIdUseCase.execute({
    companyId,
  })

  return reply.status(200).send({ businessUnits })
}
