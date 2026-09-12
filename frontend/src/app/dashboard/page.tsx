"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { AddLeadDialog } from "@/components/add-lead-dialog";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";
import { LeadTable } from "@/components/lead-table";
import { Sidebar } from "@/components/sidebar";
import { StatsCards } from "@/components/stats-cards";
import { Toolbar } from "@/components/toolbar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLeads } from "@/hooks/useLeads";
import type { LeadStatus } from "@/types/lead";

function Dashboard() {
  const { logout } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const debouncedSearch = useDebouncedValue(search, 300);

  const { leads: allLeads, isLoading: statsLoading } = useLeads();
  const {
    leads: filteredLeads,
    isLoading,
    error,
    addLead,
  } = useLeads({
    status: status === "all" ? undefined : status,
    q: debouncedSearch || undefined,
  });

  // A previously-valid token can expire mid-session; bounce back to login.
  useEffect(() => {
    if (error?.status === 401) logout();
  }, [error, logout]);

  const hasFilters = status !== "all" || debouncedSearch.length > 0;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <div className="bg-mesh flex min-w-0 flex-1 flex-col">
        <Header>
          <AddLeadDialog onCreate={addLead} />
        </Header>

        <main className="mx-auto flex w-full min-w-0 max-w-5xl flex-1 flex-col gap-6 px-5 py-6 lg:px-8 lg:py-8">
          <StatsCards leads={allLeads} isLoading={statsLoading} />

          <div className="flex min-w-0 flex-col gap-4">
            <Toolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />

            {error && error.status !== 401 && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Couldn&apos;t load leads: {error.message}
              </div>
            )}

            {!error && <LeadTable leads={filteredLeads} isLoading={isLoading} hasFilters={hasFilters} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
