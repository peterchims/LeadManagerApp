"use client";

import { LeadForm } from "@/components/LeadForm";
import { LeadTable } from "@/components/LeadTable";
import { useLeads } from "@/hooks/useLeads";

export default function Home() {
  const { leads, isLoading, error, addLead } = useLeads();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Lead Manager
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track and manage incoming leads.
          </p>
        </header>

        <LeadForm onSubmit={addLead} />

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-black/80 dark:text-white/80">
              Leads {!isLoading && `(${leads.length})`}
            </h2>
          </div>

          {isLoading && (
            <div className="rounded-lg border border-black/10 p-8 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/50">
              Loading leads...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              Couldn&apos;t load leads: {error.message}
            </div>
          )}

          {!isLoading && !error && <LeadTable leads={leads} />}
        </section>
      </main>
    </div>
  );
}
