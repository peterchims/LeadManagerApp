"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth-layout";
import { useAuth } from "@/components/auth-provider";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const inputClasses =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

export default function RegisterPage() {
  const { register, status } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your sales pipeline"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className={cn(inputClasses, fieldErrors.name && "border-destructive focus:border-destructive")}
          />
          {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className={cn(inputClasses, fieldErrors.email && "border-destructive focus:border-destructive")}
          />
          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={cn(inputClasses, fieldErrors.password && "border-destructive focus:border-destructive")}
          />
          {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>}
        </div>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="brand-gradient mt-1 inline-flex h-10 items-center justify-center rounded-lg text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
