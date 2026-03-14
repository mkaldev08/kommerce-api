import type { FastifyReply } from "fastify";
import z from "zod";
import { BusinessUnitNotAcademyError } from "@/use-cases/errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

export function handleControllerError(
  reply: FastifyReply,
  error: unknown,
): boolean {
  if (error instanceof z.ZodError) {
    reply.status(400).send({
      message: "Invalid request data",
      issues: error.issues,
    });
    return true;
  }

  if (error instanceof ResourceNotFoundError) {
    reply.status(404).send({ message: error.message });
    return true;
  }

  if (error instanceof BusinessUnitNotAcademyError) {
    reply.status(400).send({ message: error.message });
    return true;
  }

  return false;
}
