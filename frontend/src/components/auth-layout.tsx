import type { ReactNode } from "react";
import { Users } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="bg-mesh flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="brand-gradient mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="card-shadow-lg rounded-xl border border-border bg-card p-6">{children}</div>

        <p className="mt-5 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}
