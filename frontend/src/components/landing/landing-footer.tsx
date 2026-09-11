import Link from "next/link";
import { Users } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <div className="brand-gradient flex h-6 w-6 items-center justify-center rounded-md text-white">
            <Users className="h-3 w-3" />
          </div>
          <span className="text-sm font-medium text-foreground">Lead Manager</span>
        </div>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lead Manager. All rights reserved.</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/register" className="transition-colors hover:text-foreground">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}
