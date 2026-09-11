"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";
import type { Lead } from "@/types/lead";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

type SortKey = "name" | "email" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {COLUMNS.map((col) => (
            <td key={col.key} className="px-4 py-3.5">
              <div className="h-4 w-full max-w-32 animate-pulse rounded bg-muted" />
            </td>
          ))}
        </tr>
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
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
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
          {isLoading && <SkeletonRows />}

          {!isLoading && sortedLeads.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="px-4 py-12">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Inbox className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    {hasFilters ? "No leads match your filters" : "No leads yet"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hasFilters
                      ? "Try adjusting your search or status filter."
                      : "Add your first lead to get started."}
                  </p>
                </div>
              </td>
            </tr>
          )}

          {!isLoading &&
            sortedLeads.map((lead) => (
              <tr key={lead.id} className="transition-colors hover:bg-muted/50">
                <td className={cn("px-4 py-3.5 font-medium text-foreground")}>{lead.name}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{lead.email}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
