import type { Lead, LeadStatus } from "@/types/lead";
import { LEAD_STATUSES } from "@/types/lead";

function countByStatus(leads: Lead[], status: LeadStatus) {
  return leads.filter((lead) => lead.status === status).length;
}

export function StatsCards({ leads, isLoading }: { leads: Lead[]; isLoading: boolean }) {
  const cards = [
    { label: "Total leads", value: leads.length },
    ...LEAD_STATUSES.map((status) => ({ label: status, value: countByStatus(leads, status) })),
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="truncate text-xs font-medium text-muted-foreground">{card.label}</p>
          {isLoading ? (
            <div className="mt-1.5 h-6 w-10 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-card-foreground">{card.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
