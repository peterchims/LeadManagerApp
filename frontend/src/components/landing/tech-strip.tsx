import { Reveal } from "@/components/reveal";

const STACK = ["Next.js", "React", "Express", "PostgreSQL", "Prisma", "JWT Auth", "Tailwind CSS"];

export function TechStrip() {
  return (
    <Reveal className="mx-auto max-w-3xl px-5 py-4 lg:px-8">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Built with a modern, production-grade stack
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {STACK.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
