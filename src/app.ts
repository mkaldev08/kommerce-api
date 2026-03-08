import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastify } from "fastify";
import { env } from "./env";
import { appRoutes, nonAuthenticatedRoutes } from "./http/route";
import { verifyJWT } from "./middlewares/verify-jwt";

export const app = fastify();
const API_VERSION = "/api/v1";

app.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
    const isElectronOrigin = origin === "null" || !origin;

    if (isElectronOrigin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"), false);
  },
  credentials: true,
});

app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "accessToken",
    signed: true,
  },
});

// // Register Swagger for OpenAPI documentation
// app.register(swagger, swaggerConfig.swagger)

// // Register Swagger UI
// app.register(swaggerUi, swaggerConfig.uiConfig)

app.register(appRoutes, { prefix: API_VERSION, preHandler: [verifyJWT] });
app.register(nonAuthenticatedRoutes, { prefix: API_VERSION });
