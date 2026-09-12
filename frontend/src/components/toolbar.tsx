"use client";

import { Search } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: LeadStatus | "all";
  onStatusChange: (value: LeadStatus | "all") => void;
}

const FILTERS: (LeadStatus | "all")[] = ["all", ...LEAD_STATUSES];

export function Toolbar({ search, onSearchChange, status, onStatusChange }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 sm:max-w-sm"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onStatusChange(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              status === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
            )}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>
    </div>
  );
}
