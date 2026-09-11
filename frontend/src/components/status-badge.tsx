import type { LeadStatus } from "@/types/lead";

const STYLES: Record<LeadStatus, string> = {
  New: "bg-[var(--status-new-bg)] text-[var(--status-new-fg)]",
  Engaged: "bg-[var(--status-engaged-bg)] text-[var(--status-engaged-fg)]",
  "Proposal Sent": "bg-[var(--status-proposal-bg)] text-[var(--status-proposal-fg)]",
  "Closed-Won": "bg-[var(--status-won-bg)] text-[var(--status-won-fg)]",
  "Closed-Lost": "bg-[var(--status-lost-bg)] text-[var(--status-lost-fg)]",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
