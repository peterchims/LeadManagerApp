import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { logger } from "../lib/logger";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: { message: `Cannot ${req.method} ${req.path}`, code: "NOT_FOUND" },
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    if (err.status >= 500) logger.error({ err }, err.message);
    res.status(err.status).json({
      error: { message: err.message, code: err.code, details: err.details },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: "Validation failed", code: "VALIDATION_ERROR", details: err.flatten().fieldErrors },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({
      error: { message: "A record with these unique fields already exists", code: "CONFLICT" },
    });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
};
