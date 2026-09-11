import { z } from "zod";

export const LEAD_STATUSES = [
  "New",
  "Engaged",
  "Proposal Sent",
  "Closed-Won",
  "Closed-Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  email: z.string().trim().min(1, "email is required").email("email must be valid"),
  status: z.enum(LEAD_STATUSES).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
