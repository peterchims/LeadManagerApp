import { Users } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm">
          <Users className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-foreground">Lead Manager</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Sales pipeline</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        <div className="flex items-center gap-2.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
          <Users className="h-4 w-4" />
          Leads
        </div>
      </nav>

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <p className="text-[11px] text-muted-foreground">v1.0</p>
        <ThemeToggle />
      </div>
    </aside>
  );
}
