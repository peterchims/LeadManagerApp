import useSWR from "swr";
import { leadsApi } from "@/lib/api";
import type { CreateLeadInput } from "@/types/lead";

const LEADS_KEY = "/leads";

export function useLeads() {
  const { data, error, isLoading, mutate } = useSWR(LEADS_KEY, () => leadsApi.list());

  async function addLead(input: CreateLeadInput) {
    const created = await leadsApi.create(input);
    // Optimistically prepend the new lead without waiting for a refetch.
    await mutate((current) => (current ? [created, ...current] : [created]), {
      revalidate: false,
    });
    return created;
  }

  return {
    leads: data ?? [],
    isLoading,
    error: error as Error | undefined,
    addLead,
  };
}
