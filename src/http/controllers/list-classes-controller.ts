import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListClassesUseCase } from "@/use-cases/factory/make-list-classes-use-case";
import {
  businessUnitParamsSchema,
  listClassesQuerySchema,
} from "./schemas/academy-schemas";
import { handleControllerError } from "./helpers/handle-controller-error";
import { PrismaBusinessUnitRepository } from "@/repositories/prisma/prisma-business-unit-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { BusinessUnitNotAcademyError } from "@/use-cases/errors/business-unit-not-academy-error";

export async function ListClassesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessUnitId } = businessUnitParamsSchema.parse(request.params);
    const businessUnit = await new PrismaBusinessUnitRepository().findById(
      businessUnitId,
    );

    if (!businessUnit) {
      throw new ResourceNotFoundError();
    }

    if (businessUnit.type !== "ACADEMY") {
      throw new BusinessUnitNotAcademyError();
    }

    const query = listClassesQuerySchema.parse(request.query);
    const useCase = makeListClassesUseCase();
    const { classes } = await useCase.execute(query.schoolYearId);

    return reply.status(200).send({ classes });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }
    throw error;
  }
}
