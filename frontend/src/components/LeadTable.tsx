import type { Lead } from "@/types/lead";
import { StatusBadge } from "./StatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function LeadTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-black/15 p-8 text-center text-sm text-black/50 dark:border-white/15 dark:text-white/50">
        No leads yet. Add your first lead using the form.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-black/5 text-xs uppercase tracking-wide text-black/60 dark:bg-white/5 dark:text-white/60">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10 dark:divide-white/10">
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-3 font-medium">{lead.name}</td>
              <td className="px-4 py-3 text-black/70 dark:text-white/70">{lead.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-black/50 dark:text-white/50">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
