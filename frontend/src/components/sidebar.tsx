"use client";

import Link from "next/link";
import { LogOut, Users } from "lucide-react";
import { useAuth } from "./auth-provider";
import { LeadAvatar } from "./lead-avatar";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex items-center justify-between gap-2.5 px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-foreground">Lead Manager</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Sales pipeline</p>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-3 py-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
        >
          <Users className="h-4 w-4" />
          Leads
        </Link>
      </nav>

      {user && (
        <div className="flex items-center gap-2.5 border-t border-border px-4 py-4">
          <LeadAvatar name={user.name} className="h-8 w-8 text-[11px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={logout}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
