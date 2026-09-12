import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/AppError";
import { verifyToken } from "../lib/jwt";

export interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; name: string };
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    return next(new UnauthorizedError("Missing or invalid Authorization header"));
  }

  try {
    const payload = verifyToken(token);
    (req as AuthenticatedRequest).user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Session expired, please log in again"));
    }
    next(new UnauthorizedError("Invalid or expired token"));
  }
}
