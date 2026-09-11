import type { ReactNode } from "react";
import { Users } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="brand-gradient flex h-7 w-7 items-center justify-center rounded-md text-white">
            <Users className="h-3.5 w-3.5" />
          </div>
          <p className="text-sm font-semibold text-foreground">Lead Manager</p>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">Track and manage your sales pipeline</p>
        </div>

        <div className="flex items-center gap-2">
          {children}
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
