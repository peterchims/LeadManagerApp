import { Filter, Moon, Search, ShieldCheck, Smartphone, Zap } from "lucide-react";
import type { ComponentType } from "react";
import { Reveal } from "@/components/reveal";

const FEATURES: { icon: ComponentType<{ className?: string }>; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Live search & filtering",
    description: "Find any lead instantly by name or email, and narrow the list by pipeline status in one click.",
  },
  {
    icon: Filter,
    title: "Pipeline visibility",
    description: "See exactly how many leads sit in New, Engaged, Proposal Sent, Closed-Won, and Closed-Lost at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description: "Passwords are hashed with bcrypt and every session is backed by a signed JWT — no plaintext, ever.",
  },
  {
    icon: Zap,
    title: "Fast, validated API",
    description: "An Express + PostgreSQL backend with Zod validation on every request, rate limiting, and structured logs.",
  },
  {
    icon: Smartphone,
    title: "Works on any screen",
    description: "A fully responsive layout that holds up from a wide desktop dashboard down to a phone in your pocket.",
  },
  {
    icon: Moon,
    title: "Light & dark mode",
    description: "A refined interface that adapts to your system theme, or your own preference, instantly.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Everything you need to run your pipeline
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          No clutter, no busywork — just the tools that keep your leads moving forward.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Reveal key={feature.title} delayMs={i * 80}>
              <div className="card-shadow group h-full rounded-xl border border-border bg-card p-5 transition-transform hover:-translate-y-1">
                <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-lg text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-card-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
