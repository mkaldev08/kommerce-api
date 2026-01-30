import cors from "@fastify/cors";
import { fastify } from "fastify";
import { env } from "./env";
import { appRoutes } from "./http/route";

export const app = fastify();
const API_VERSION = "/api/v1";

app.register(appRoutes, { prefix: API_VERSION });
app.register(cors, {
  origin: env.NODE_ENV === "production" ? [] : "http://localhost:5173",
  credentials: true,
});
