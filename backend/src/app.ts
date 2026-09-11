import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";
import { leadsRouter } from "./routes/leads";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  // Render (and most PaaS hosts) sit behind a reverse proxy; trust the first
  // hop so req.ip and rate limiting see the real client IP.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: env.CORS_ORIGINS }));
  app.use(express.json({ limit: "100kb" }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => req.url === "/health" },
    }),
  );

  const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(apiLimiter);

  app.get("/", (_req, res) => {
    res.json({ name: "Lead Manager API", status: "ok", docs: "/health, /leads" });
  });

  app.get("/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok" });
    } catch {
      res.status(503).json({ status: "error", message: "Database unreachable" });
    }
  });

  app.use("/leads", leadsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
