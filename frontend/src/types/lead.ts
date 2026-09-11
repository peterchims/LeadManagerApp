export const LEAD_STATUSES = [
  "New",
  "Engaged",
  "Proposal Sent",
  "Closed-Won",
  "Closed-Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
}
