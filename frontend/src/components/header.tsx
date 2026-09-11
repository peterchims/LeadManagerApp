import type { ReactNode } from "react";
import { Users } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none text-foreground">Lead Manager</h1>
            <p className="mt-1 text-xs text-muted-foreground">Track and manage incoming leads</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
