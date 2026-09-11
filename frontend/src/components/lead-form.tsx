"use client";

import { useId, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";
import { cn } from "@/lib/utils";

interface LeadFormProps {
  onSubmit: (input: { name: string; email: string; status: LeadStatus }) => Promise<unknown>;
  onSuccess?: () => void;
}

const inputClasses =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

export function LeadForm({ onSubmit, onSuccess }: LeadFormProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LeadStatus>("New");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), status });
      setName("");
      setEmail("");
      setStatus("New");
      onSuccess?.();
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-name`} className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id={`${formId}-name`}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className={cn(inputClasses, fieldErrors.name && "border-destructive focus:border-destructive")}
        />
        {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-email`} className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className={cn(inputClasses, fieldErrors.email && "border-destructive focus:border-destructive")}
        />
        {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-status`} className="text-sm font-medium text-foreground">
          Status
        </label>
        <select
          id={`${formId}-status`}
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          className={inputClasses}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="brand-gradient mt-1 inline-flex h-10 items-center justify-center rounded-lg text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add lead"}
      </button>
    </form>
  );
}
