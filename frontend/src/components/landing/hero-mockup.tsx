import { CheckCircle2, Flame, Sparkles } from "lucide-react";
import { LeadAvatar } from "@/components/lead-avatar";
import { StatusBadge } from "@/components/status-badge";
import type { LeadStatus } from "@/types/lead";

const PREVIEW_ROWS: { name: string; email: string; status: LeadStatus }[] = [
  { name: "Amara Okafor", email: "amara@northwind.io", status: "Proposal Sent" },
  { name: "Daniel Kim", email: "daniel@brightpath.co", status: "Engaged" },
  { name: "Sofia Rossi", email: "sofia@lumen.dev", status: "Closed-Won" },
];

const STAT_CARDS = [
  { label: "Leads", value: "128", icon: Sparkles },
  { label: "Engaged", value: "34", icon: Flame },
  { label: "Won", value: "19", icon: CheckCircle2 },
];

export function HeroMockup() {
  return (
    <div
      aria-hidden
      className="card-shadow-lg animate-float-slow relative mx-auto w-full max-w-lg rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--status-lost-fg)]/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--status-engaged-fg)]/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--status-won-fg)]/60" />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2.5">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-border bg-background px-3 py-2.5">
              <div className="flex items-center justify-between">
                <p className="truncate text-[10px] font-medium text-muted-foreground">{card.label}</p>
                <Icon className="h-3 w-3 text-muted-foreground/70" />
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        {PREVIEW_ROWS.map((row, i) => (
          <div
            key={row.email}
            className={`flex items-center gap-3 px-3 py-2.5 ${i !== 0 ? "border-t border-border" : ""}`}
          >
            <LeadAvatar name={row.name} className="h-7 w-7 text-[10px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{row.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{row.email}</p>
            </div>
            <StatusBadge status={row.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
