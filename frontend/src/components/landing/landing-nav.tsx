"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNav() {
  const { status } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm">
            <Users className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-foreground">Lead Manager</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="brand-gradient inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="brand-gradient inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
