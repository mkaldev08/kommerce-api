import z, { ZodError } from "zod";
import { app } from "./app";
import { env } from "./env";
import { writeRuntimeErrorLog } from "./lib/runtime-error-log";

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== "object") {
    return body;
  }

  const clone = { ...(body as Record<string, unknown>) };

  if ("password" in clone) {
    clone.password = "***";
  }

  if ("password_hash" in clone) {
    clone.password_hash = "***";
  }

  return clone;
}

process.on("uncaughtException", (error) => {
  console.error(error);
  void writeRuntimeErrorLog("process:uncaughtException", error);
});

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  void writeRuntimeErrorLog("process:unhandledRejection", reason);
});

app.setErrorHandler((error, request, reply) => {
  void writeRuntimeErrorLog("http:error", error, {
    method: request.method,
    url: request.url,
    params: request.params,
    query: request.query,
    body: sanitizeBody(request.body),
  });

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação.",
      issues: z.treeifyError(error),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here you can integrate with a logging service like Sentry, LogRocket, etc.
  }

  return reply.status(500).send({ message: "Erro interno do servidor." });
});

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => {
    console.log(`Server is running at ${env.PORT}`);
  })
  .catch((error) => {
    console.error(error);
    void writeRuntimeErrorLog("server:listen", error, {
      port: env.PORT,
      host: "0.0.0.0",
    });
    process.exit(1);
  });
