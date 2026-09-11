"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, UserRoundSearch } from "lucide-react";
import type { Lead } from "@/types/lead";
import { StatusBadge } from "./status-badge";
import { LeadAvatar } from "./lead-avatar";

type SortKey = "name" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: "name", label: "Lead" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created", className: "text-right" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <UserRoundSearch className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          {hasFilters ? "No leads match your filters" : "No leads yet"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {hasFilters ? "Try adjusting your search or status filter." : "Add your first lead to get started."}
        </p>
      </div>
    </div>
  );
}

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <div className="skeleton h-3.5 w-28 rounded" />
                <div className="skeleton h-3 w-36 rounded" />
              </div>
            </div>
          </td>
          <td className="px-5 py-3.5">
            <div className="skeleton h-5 w-20 rounded-full" />
          </td>
          <td className="px-5 py-3.5 text-right">
            <div className="skeleton ml-auto h-3.5 w-24 rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}

function CardSkeletons() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
          <div className="skeleton h-10 w-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="skeleton h-3.5 w-32 rounded" />
            <div className="skeleton h-3 w-40 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

export function LeadTable({
  leads,
  isLoading,
  hasFilters,
}: {
  leads: Lead[];
  isLoading: boolean;
  hasFilters: boolean;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedLeads = useMemo(() => {
    const copy = [...leads];
    copy.sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [leads, sortKey, sortDirection]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  return (
    <div className="card-shadow min-w-0 overflow-hidden rounded-xl border border-border bg-card">
      {/* Below `sm`, a table can't fit three columns without cramming or scrolling —
          a stacked card list reads far better on a phone. */}
      <div className="sm:hidden">
        {isLoading && <CardSkeletons />}
        {!isLoading && sortedLeads.length === 0 && <EmptyState hasFilters={hasFilters} />}
        {!isLoading && sortedLeads.length > 0 && (
          <div className="divide-y divide-border">
            {sortedLeads.map((lead, i) => (
              <div
                key={lead.id}
                style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                className="animate-row-in flex items-center gap-3 px-4 py-3.5"
              >
                <LeadAvatar name={lead.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{lead.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={lead.status} />
                  <p className="text-[11px] text-muted-foreground">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* `sm` and up: full sortable table. */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className={`px-5 py-3 font-medium ${col.className ?? ""}`}>
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex items-center gap-1 transition-colors hover:text-foreground ${col.className ? "flex-row-reverse" : ""}`}
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <TableSkeletonRows />}

            {!isLoading && sortedLeads.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length}>
                  <EmptyState hasFilters={hasFilters} />
                </td>
              </tr>
            )}

            {!isLoading &&
              sortedLeads.map((lead, i) => (
                <tr
                  key={lead.id}
                  style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                  className="animate-row-in group transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <LeadAvatar name={lead.name} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{lead.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                    <p>{formatDate(lead.createdAt)}</p>
                    {lead.createdBy && (
                      <p className="mt-0.5 hidden text-[11px] text-muted-foreground/70 md:block">
                        by {lead.createdBy.name}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
