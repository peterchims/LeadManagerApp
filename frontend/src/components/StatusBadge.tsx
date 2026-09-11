import type { LeadStatus } from "@/types/lead";

const STYLES: Record<LeadStatus, string> = {
  New: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Engaged: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Proposal Sent": "bg-purple-50 text-purple-700 ring-purple-600/20",
  "Closed-Won": "bg-green-50 text-green-700 ring-green-600/20",
  "Closed-Lost": "bg-red-50 text-red-700 ring-red-600/20",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
