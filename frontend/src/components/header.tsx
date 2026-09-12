"use client";

import type { ReactNode } from "react";
import { LogOut, Users } from "lucide-react";
import { useAuth } from "./auth-provider";
import { ThemeToggle } from "./theme-toggle";

export function Header({ children }: { children?: ReactNode }) {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
          <div className="brand-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white">
            <Users className="h-3.5 w-3.5" />
          </div>
          <p className="truncate whitespace-nowrap text-sm font-semibold text-foreground">Lead Manager</p>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-base font-semibold tracking-tight text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">Track and manage your sales pipeline</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {children}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Sign out"
              onClick={logout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
