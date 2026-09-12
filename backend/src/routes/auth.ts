import { Router } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, type AuthenticatedRequest } from "../middleware/requireAuth";
import { loginSchema, registerSchema } from "../schemas/auth";
import { ConflictError, UnauthorizedError } from "../errors/AppError";

export const authRouter = Router();

function toPublicUser(user: { id: string; name: string; email: string; createdAt: Date }) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

// POST /auth/register
authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash },
    });

    const token = signToken({ sub: user.id, email: user.email, name: user.name });
    res.status(201).json({ user: toPublicUser(user), token });
  }),
);

// POST /auth/login
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = signToken({ sub: user.id, email: user.email, name: user.name });
    res.json({ user: toPublicUser(user), token });
  }),
);

// GET /auth/me - validate a stored token and hydrate the current user
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id } = (req as AuthenticatedRequest).user;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new UnauthorizedError("User no longer exists");
    }

    res.json({ user: toPublicUser(user) });
  }),
);
