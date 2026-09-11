import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { createLeadSchema } from "../schemas/lead";

export const leadsRouter = Router();

// GET /leads - fetch all leads, newest first
leadsRouter.get("/", async (_req, res) => {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(leads);
});

// POST /leads - create a new lead
leadsRouter.post("/", async (req, res) => {
  const parsed = createLeadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        status: parsed.data.status ?? "New",
      },
    });
    res.status(201).json(lead);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(409).json({ error: "A lead with this email already exists" });
    }
    throw err;
  }
});
