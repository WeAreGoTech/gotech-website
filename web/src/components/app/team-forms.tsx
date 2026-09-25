"use client";

import { useRef } from "react";
import { toOptions } from "@/components/forms/fields";
import { Select } from "@/components/forms/Select";
import type { LeadStatus } from "@/db/schema";
import { LEAD_STATUS_LABELS } from "@/features/leads/labels";

/** Saves as soon as a new status is picked; without JavaScript a save button is shown instead. */
export function LeadStatusForm({ action, status }: { action: (formData: FormData) => Promise<void>; status: LeadStatus }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={action} className="inline-form">
      <Select name="status" aria-label="Başvuru durumu" defaultValue={status} options={toOptions(LEAD_STATUS_LABELS)} onValueChange={() => formRef.current?.requestSubmit()} />
      <noscript><button className="btn btn-small" type="submit">Kaydet</button></noscript>
    </form>
  );
}
