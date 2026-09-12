import useSWR from "swr";
import { leadsApi, type ApiError, type ListLeadsFilters } from "@/lib/api";
import type { CreateLeadInput } from "@/types/lead";

function keyFor(filters: ListLeadsFilters) {
  return ["/leads", filters.status ?? "", filters.q ?? ""] as const;
}

export function useLeads(filters: ListLeadsFilters = {}) {
  const { data, error, isLoading, mutate } = useSWR(keyFor(filters), () => leadsApi.list(filters));

  async function addLead(input: CreateLeadInput) {
    const created = await leadsApi.create(input);
    // Refresh from the server so filters/sorting stay authoritative.
    await mutate();
    return created;
  }

  return {
    leads: data ?? [],
    isLoading,
    error: error as ApiError | undefined,
    addLead,
  };
}
