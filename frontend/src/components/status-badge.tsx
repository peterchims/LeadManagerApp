import type { LeadStatus } from "@/types/lead";

const STYLES: Record<LeadStatus, { bg: string; fg: string; dot: string }> = {
  New: { bg: "bg-[var(--status-new-bg)]", fg: "text-[var(--status-new-fg)]", dot: "bg-[var(--status-new-fg)]" },
  Engaged: {
    bg: "bg-[var(--status-engaged-bg)]",
    fg: "text-[var(--status-engaged-fg)]",
    dot: "bg-[var(--status-engaged-fg)]",
  },
  "Proposal Sent": {
    bg: "bg-[var(--status-proposal-bg)]",
    fg: "text-[var(--status-proposal-fg)]",
    dot: "bg-[var(--status-proposal-fg)]",
  },
  "Closed-Won": {
    bg: "bg-[var(--status-won-bg)]",
    fg: "text-[var(--status-won-fg)]",
    dot: "bg-[var(--status-won-fg)]",
  },
  "Closed-Lost": {
    bg: "bg-[var(--status-lost-bg)]",
    fg: "text-[var(--status-lost-fg)]",
    dot: "bg-[var(--status-lost-fg)]",
  },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const style = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.fg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
