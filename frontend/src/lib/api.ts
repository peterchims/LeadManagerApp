import type { CreateLeadInput, Lead } from "@/types/lead";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error ?? `Request failed with status ${res.status}`, res.status, body?.details);
  }

  return res.json() as Promise<T>;
}

export const leadsApi = {
  list: () => request<Lead[]>("/leads"),
  create: (input: CreateLeadInput) =>
    request<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
