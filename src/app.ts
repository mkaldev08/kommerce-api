import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import { fastify } from "fastify";
import { env } from "./env";
import { appRoutes, nonAuthenticatedRoutes } from "./http/route";
import { verifyJWT } from "./middlewares/verify-jwt";
import { initializeFinancialPlansCronJob } from "./lib/cron-jobs";

export const app = fastify();
const API_VERSION = "/api/v1";

app.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = new Set([
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]);
    const normalizedOrigin = (origin ?? "").replace(/\/$/, "");
    const isElectronOrigin =
      !origin ||
      origin === "null" ||
      normalizedOrigin.startsWith("file://") ||
      normalizedOrigin.startsWith("app://");

    if (isElectronOrigin || allowedOrigins.has(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

const FOUR_MB_IN_BYTES = 4 * 1024 * 1024;
app.register(fastifyMultipart, {
  attachFieldsToBody: false,
  limits: {
    files: 1,
    fileSize: FOUR_MB_IN_BYTES,
  },
});

// // Register Swagger for OpenAPI documentation
// app.register(swagger, swaggerConfig.swagger)

// // Register Swagger UI
// app.register(swaggerUi, swaggerConfig.uiConfig)

app.register(appRoutes, { prefix: API_VERSION, preHandler: [verifyJWT] });
app.register(nonAuthenticatedRoutes, { prefix: API_VERSION });

// Initialize cron jobs
initializeFinancialPlansCronJob();
