import { CheckCircle2, FileText, Flame, Sparkles, Users, XCircle } from "lucide-react";
import type { ComponentType } from "react";
import type { Lead, LeadStatus } from "@/types/lead";
import { LEAD_STATUSES } from "@/types/lead";

function countByStatus(leads: Lead[], status: LeadStatus) {
  return leads.filter((lead) => lead.status === status).length;
}

const STATUS_META: Record<LeadStatus, { icon: ComponentType<{ className?: string }>; accent: string }> = {
  New: { icon: Sparkles, accent: "bg-[var(--status-new-fg)]" },
  Engaged: { icon: Flame, accent: "bg-[var(--status-engaged-fg)]" },
  "Proposal Sent": { icon: FileText, accent: "bg-[var(--status-proposal-fg)]" },
  "Closed-Won": { icon: CheckCircle2, accent: "bg-[var(--status-won-fg)]" },
  "Closed-Lost": { icon: XCircle, accent: "bg-[var(--status-lost-fg)]" },
};

export function StatsCards({ leads, isLoading }: { leads: Lead[]; isLoading: boolean }) {
  const cards = [
    { label: "Total leads", value: leads.length, icon: Users, accent: "bg-primary" },
    ...LEAD_STATUSES.map((status) => ({
      label: status,
      value: countByStatus(leads, status),
      icon: STATUS_META[status].icon,
      accent: STATUS_META[status].accent,
    })),
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="card-shadow group relative overflow-hidden rounded-xl border border-border bg-card px-4 py-3.5 transition-transform hover:-translate-y-0.5"
          >
            <span className={`absolute inset-x-0 top-0 h-0.5 ${card.accent}`} />
            <div className="flex items-center justify-between">
              <p className="truncate text-xs font-medium text-muted-foreground">{card.label}</p>
              <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
            </div>
            {isLoading ? (
              <div className="skeleton mt-2 h-7 w-12 rounded-md" />
            ) : (
              <p className="mt-1 text-xl font-semibold tabular-nums text-card-foreground">{card.value}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
