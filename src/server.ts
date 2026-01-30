import z, { ZodError } from "zod";
import { app } from "./app";
import { env } from "./env";

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: "Validation error.",
      issues: z.treeifyError(error),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here you can integrate with a logging service like Sentry, LogRocket, etc.
  }

  reply.status(500).send({ message: "Internal server error." });
});

app.listen({ port: env.PORT, host: "0.0.0.0" }, () =>
  console.log(`Server is running at ${env.PORT}`),
);
