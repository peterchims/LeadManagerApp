import type { CreateLeadInput, Lead, LeadStatus } from "@/types/lead";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorBody {
  error?: {
    message?: string;
    code?: string;
    details?: Record<string, string[] | undefined>;
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the API running?", 0, "NETWORK_ERROR");
  }

  if (!res.ok) {
    const body: ErrorBody | null = await res.json().catch(() => null);
    throw new ApiError(
      body?.error?.message ?? `Request failed with status ${res.status}`,
      res.status,
      body?.error?.code,
      body?.error?.details,
    );
  }

  return res.json() as Promise<T>;
}

export interface ListLeadsFilters {
  status?: LeadStatus;
  q?: string;
}

export const leadsApi = {
  list: (filters: ListLeadsFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.q) params.set("q", filters.q);
    const query = params.toString();
    return request<Lead[]>(`/leads${query ? `?${query}` : ""}`);
  },
  create: (input: CreateLeadInput) =>
    request<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
