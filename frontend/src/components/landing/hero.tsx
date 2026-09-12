"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { HeroMockup } from "./hero-mockup";

export function Hero() {
  const { status } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="bg-dot-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="animate-float-slower absolute -right-24 top-10 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="animate-fade-up flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Secure, multi-user lead tracking
          </span>

          <h1 className="max-w-lg text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Manage your sales pipeline with <span className="text-gradient">absolute clarity</span>
          </h1>

          <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
            Track every lead from first contact to closed deal. Search, filter, and monitor your pipeline in a
            fast, secure dashboard built for small sales teams.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={status === "authenticated" ? "/dashboard" : "/register"}
              className="brand-gradient inline-flex h-11 items-center justify-center gap-1.5 rounded-lg px-6 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              {status === "authenticated" ? "Go to dashboard" : "Get started free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {status !== "authenticated" && (
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
