import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import { Prisma } from "@prisma/client";
import { createApp } from "../app";
import { signToken } from "../lib/jwt";

const { findMany, create } = vi.hoisted(() => ({
  findMany: vi.fn(),
  create: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    lead: { findMany, create },
    user: { findUnique: vi.fn() },
    $queryRaw: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

const authHeader = `Bearer ${signToken({ sub: "user-1", email: "owner@example.com", name: "Owner" })}`;

const sampleLead = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Jane Doe",
  email: "jane@example.com",
  status: "New",
  createdAt: new Date().toISOString(),
};

describe("auth gate on /leads", () => {
  it("rejects requests with no token", async () => {
    const app = createApp();

    const res = await request(app).get("/leads");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects requests with a malformed token", async () => {
    const app = createApp();

    const res = await request(app).get("/leads").set("Authorization", "Bearer not-a-real-token");

    expect(res.status).toBe(401);
  });
});

describe("GET /leads", () => {
  beforeEach(() => {
    findMany.mockReset();
    create.mockReset();
  });

  it("returns all leads ordered by newest first", async () => {
    findMany.mockResolvedValue([sampleLead]);
    const app = createApp();

    const res = await request(app).get("/leads").set("Authorization", authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([sampleLead]);
    expect(findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  });

  it("filters by status query param", async () => {
    findMany.mockResolvedValue([]);
    const app = createApp();

    await request(app).get("/leads").set("Authorization", authHeader).query({ status: "Engaged" });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: "Engaged" } }),
    );
  });

  it("rejects an invalid status filter", async () => {
    const app = createApp();

    const res = await request(app).get("/leads").set("Authorization", authHeader).query({ status: "Bogus" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("POST /leads", () => {
  beforeEach(() => {
    findMany.mockReset();
    create.mockReset();
  });

  it("creates a lead with a default status of New", async () => {
    create.mockResolvedValue(sampleLead);
    const app = createApp();

    const res = await request(app)
      .post("/leads")
      .set("Authorization", authHeader)
      .send({ name: "Jane Doe", email: "jane@example.com" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(sampleLead);
    expect(create).toHaveBeenCalledWith({
      data: { name: "Jane Doe", email: "jane@example.com", status: "New", createdById: "user-1" },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  });

  it("rejects a request missing required fields", async () => {
    const app = createApp();

    const res = await request(app).post("/leads").set("Authorization", authHeader).send({ name: "" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/leads")
      .set("Authorization", authHeader)
      .send({ name: "Jane Doe", email: "not-an-email" });

    expect(res.status).toBe(400);
  });

  it("returns 409 when the email already exists", async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.22.0",
      }),
    );
    const app = createApp();

    const res = await request(app)
      .post("/leads")
      .set("Authorization", authHeader)
      .send({ name: "Jane Doe", email: "jane@example.com" });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONFLICT");
  });
});
