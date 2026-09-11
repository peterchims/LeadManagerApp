"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useAuth } from "@/components/auth-provider";

export function CtaSection() {
  const { status } = useAuth();

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <Reveal className="bg-mesh card-shadow-lg relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Ready to get your pipeline organized?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Create a free account and start tracking leads in under a minute.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={status === "authenticated" ? "/dashboard" : "/register"}
            className="brand-gradient inline-flex h-11 items-center gap-1.5 rounded-lg px-6 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            {status === "authenticated" ? "Go to dashboard" : "Get started free"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {status !== "authenticated" && (
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Sign in
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}
