"use client";

import { useRef, useState } from "react";
import { FormMessage, SelectField, TextField, toOptions } from "@/components/forms/fields";
import { Select } from "@/components/forms/Select";
import { useFormAction } from "@/components/forms/use-form-action";
import type { LeadStatus } from "@/db/schema";
import { inviteCustomer } from "@/features/customers/actions";
import { LEAD_STATUS_LABELS } from "@/features/leads/labels";

const NEW_COMPANY = "new";

export function InviteCustomerForm({ companies }: { companies: { id: string; name: string }[] }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(inviteCustomer);
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? NEW_COMPANY);

  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      <h2>Müşteri davet et</h2>
      <SelectField
        label="Firma"
        name="companyId"
        value={companyId}
        onValueChange={setCompanyId}
        options={[...companies.map((c) => ({ value: c.id, label: c.name })), { value: NEW_COMPANY, label: "Yeni firma ekle" }]}
        error={errorFor("companyId")}
      />
      {companyId === NEW_COMPANY && <TextField label="Yeni firmanın adı" name="companyName" error={errorFor("companyName")} />}
      <TextField label="Ad soyad" name="name" autoComplete="off" error={errorFor("name")} />
      <TextField label="E-posta" name="email" type="email" autoComplete="off" error={errorFor("email")} />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Gönderiliyor…" : "Davet e-postası gönder"}</button>
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>Kişi, e-postadaki bağlantıdan şifresini belirleyip panele girer.</p>
    </form>
  );
}

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
