import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { MakeAuthenticateUseCase } from "@/use-cases/factory/make-authenticate-use-case";

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    password: z.string(),
    username: z.string().trim().min(5),
  });
  const { password, username } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = MakeAuthenticateUseCase();

    await authenticateUseCase.execute({
      password,
      username,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(401).send({ message: err.message });
    }
    throw err;
  }

  reply.status(200).send();
}
