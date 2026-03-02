import type { FastifyReply } from "fastify";
import z from "zod";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

export const handleControllerError = (
  reply: FastifyReply,
  err: unknown,
): boolean => {
  if (err instanceof z.ZodError) {
    reply.status(400).send({ message: "Invalid request data" });
    return true;
  }

  if (err instanceof ResourceNotFoundError) {
    reply.status(404).send({ message: err.message });
    return true;
  }

  return false;
};
