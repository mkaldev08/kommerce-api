import type { FastifyReply } from "fastify";
import z from "zod";
import { AcademyFinancialConfigMissingError } from "@/use-cases/errors/academy-financial-config-missing-error";
import { BusinessUnitNotAcademyError } from "@/use-cases/errors/business-unit-not-academy-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { Prisma } from "../../../../generated/prisma/client";

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

  if (error instanceof AcademyFinancialConfigMissingError) {
    reply.status(400).send({ message: error.message });
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta?.target.join(", ")
        : String(error.meta?.target ?? "campo único");

      reply.status(409).send({
        message: `Conflito de dados: valor duplicado em ${target}`,
      });
      return true;
    }

    if (error.code === "P2003") {
      reply.status(400).send({
        message: "Referência inválida para relacionamento.",
      });
      return true;
    }

    if (error.code === "P2025") {
      reply.status(404).send({
        message: "Registo não encontrado.",
      });
      return true;
    }

    if (error.code === "P2022") {
      reply.status(500).send({
        message:
          "Schema da base de dados desatualizado. Execute as migrações pendentes.",
      });
      return true;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    reply.status(400).send({
      message: "Dados inválidos para a operação solicitada.",
    });
    return true;
  }

  return false;
}
