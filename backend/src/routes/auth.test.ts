import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import { Prisma } from "@prisma/client";
import { createApp } from "../app";
import { hashPassword } from "../lib/password";
import { signToken } from "../lib/jwt";

const { findUnique, create } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    user: { findUnique, create },
    lead: { findMany: vi.fn(), create: vi.fn() },
    $queryRaw: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

const now = new Date().toISOString();

describe("POST /auth/register", () => {
  beforeEach(() => {
    findUnique.mockReset();
    create.mockReset();
  });

  it("creates a user and returns a token", async () => {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      passwordHash: "hashed",
      createdAt: now,
    });
    const app = createApp();

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Jane Doe", email: "jane@example.com", password: "supersecret123" });

    expect(res.status).toBe(201);
    expect(res.body.user).toEqual({ id: "user-1", name: "Jane Doe", email: "jane@example.com", createdAt: now });
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("rejects a password shorter than 8 characters", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Jane Doe", email: "jane@example.com", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(create).not.toHaveBeenCalled();
  });

  it("returns 409 when the email is already registered", async () => {
    findUnique.mockResolvedValue({ id: "existing-user" });
    const app = createApp();

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Jane Doe", email: "jane@example.com", password: "supersecret123" });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONFLICT");
  });

  it("returns 409 on a race-condition unique constraint violation", async () => {
    findUnique.mockResolvedValue(null);
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.22.0",
      }),
    );
    const app = createApp();

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Jane Doe", email: "jane@example.com", password: "supersecret123" });

    expect(res.status).toBe(409);
  });
});

describe("POST /auth/login", () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it("logs in with correct credentials", async () => {
    const passwordHash = await hashPassword("correct-password");
    findUnique.mockResolvedValue({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      passwordHash,
      createdAt: now,
    });
    const app = createApp();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "jane@example.com", password: "correct-password" });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe("jane@example.com");
  });

  it("rejects an unknown email without revealing it doesn't exist", async () => {
    findUnique.mockResolvedValue(null);
    const app = createApp();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nobody@example.com", password: "whatever123" });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid email or password");
  });

  it("rejects an incorrect password", async () => {
    const passwordHash = await hashPassword("correct-password");
    findUnique.mockResolvedValue({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      passwordHash,
      createdAt: now,
    });
    const app = createApp();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "jane@example.com", password: "wrong-password" });

    expect(res.status).toBe(401);
  });
});

describe("GET /auth/me", () => {
  it("rejects requests without a token", async () => {
    const app = createApp();

    const res = await request(app).get("/auth/me");

    expect(res.status).toBe(401);
  });

  it("returns the current user for a valid token", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      passwordHash: "hashed",
      createdAt: now,
    });
    const app = createApp();
    const token = signToken({ sub: "user-1", email: "jane@example.com", name: "Jane Doe" });

    const res = await request(app).get("/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("jane@example.com");
  });
});
