"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { LeadForm } from "./lead-form";
import type { CreateLeadInput } from "@/types/lead";

interface AddLeadDialogProps {
  onCreate: (input: CreateLeadInput) => Promise<unknown>;
}

export function AddLeadDialog({ onCreate }: AddLeadDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="brand-gradient inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add lead
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-20 bg-black/50 backdrop-blur-[2px]" />
        <Dialog.Content className="dialog-content card-shadow-lg fixed left-1/2 top-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 focus:outline-none">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-lg text-white">
                <UserPlus className="h-4 w-4" />
              </div>
              <div>
                <Dialog.Title className="text-sm font-semibold text-card-foreground">Add a new lead</Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground">
                  Enter their details below
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          <LeadForm
            onSubmit={async (input) => {
              const created = await onCreate(input);
              toast.success(`Added ${input.name}`);
              return created;
            }}
            onSuccess={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
