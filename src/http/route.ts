import type { FastifyInstance } from "fastify";
import { authenticateUser } from "./controllers/authenticate-controller";
import { registerUser } from "./controllers/register-user-controller";

export function appRoutes(app: FastifyInstance) {
  app.post("/users", registerUser);
  app.post("/sessions", authenticateUser);
}
