import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import type { AuthenticatedRequest } from "../middleware/requireAuth";
import { createLeadSchema, listLeadsQuerySchema } from "../schemas/lead";

export const leadsRouter = Router();

const createdBySelect = { createdBy: { select: { id: true, name: true } } } satisfies Prisma.LeadInclude;

// GET /leads?status=New&q=jane - fetch leads, newest first, with optional filtering
leadsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = listLeadsQuerySchema.parse(req.query);

    const where: Prisma.LeadWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { email: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: createdBySelect,
    });
    res.json(leads);
  }),
);

// POST /leads - create a new lead
leadsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createLeadSchema.parse(req.body);
    const { id: userId } = (req as AuthenticatedRequest).user;

    const lead = await prisma.lead.create({
      data: {
        name: input.name,
        email: input.email,
        status: input.status ?? "New",
        createdById: userId,
      },
      include: createdBySelect,
    });
    res.status(201).json(lead);
  }),
);
