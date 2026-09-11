"use client";

import { Search } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: LeadStatus | "all";
  onStatusChange: (value: LeadStatus | "all") => void;
}

export function Toolbar({ search, onSearchChange, status, onStatusChange }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as LeadStatus | "all")}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
      >
        <option value="all">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
