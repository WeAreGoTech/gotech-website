"use client";

import { useRef } from "react";
import { FormMessage, SelectField, TextAreaField, TextField, toOptions } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import type { ProjectStage } from "@/db/schema";
import { DOCUMENT_KIND_LABELS } from "@/features/documents/labels";
import { createProject } from "@/features/projects/actions";
import { SERVICE_LABELS, STAGE_LABELS } from "@/features/projects/labels";
import type { ActionState } from "@/lib/forms";

type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;
type Option = { id: string; name: string };

/** Name, e-mail and role; used for inviting a colleague (customer) and a team member (staff). */
export function InvitePersonForm({ action, title, hint, submitLabel }: { action: FormAction; title: string; hint: string; submitLabel: string }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      <h2>{title}</h2>
      <TextField label="Ad soyad" name="name" autoComplete="off" error={errorFor("name")} />
      <TextField label="E-posta" name="email" type="email" autoComplete="off" error={errorFor("email")} />
      <TextField label="Görev" name="title" optional placeholder="Örneğin: Satın alma" error={errorFor("title")} />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Gönderiliyor…" : submitLabel}</button>
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>{hint}</p>
    </form>
  );
}

export function CreateProjectForm({ companies }: { companies: Option[] }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(createProject);
  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate>
      <h2>Yeni proje</h2>
      <SelectField label="Firma" name="companyId" options={companies.map((c) => ({ value: c.id, label: c.name }))} error={errorFor("companyId")} />
      <TextField label="Proje adı" name="name" placeholder="Örneğin: Bayi portalı" error={errorFor("name")} />
      <div className="form-grid">
        <SelectField label="Hizmet" name="service" options={toOptions(SERVICE_LABELS)} error={errorFor("service")} />
        <TextField label="Hedef tarih" name="dueOn" type="date" optional error={errorFor("dueOn")} />
      </div>
      <TextAreaField label="Kısa açıklama" name="summary" rows={3} optional error={errorFor("summary")} />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Oluşturuluyor…" : "Projeyi oluştur"}</button>
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>Hizmet türüne göre standart aşamalar eklenir, müşteri panelinde hemen görünür.</p>
    </form>
  );
}

export function AddDocumentForm({ action, projects }: { action: FormAction; projects: Option[] }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      <h2>Doküman ekle</h2>
      <TextField label="Doküman adı" name="title" placeholder="Örneğin: Eylül bakım raporu" error={errorFor("title")} />
      <div className="form-grid">
        <SelectField label="Tür" name="kind" options={toOptions(DOCUMENT_KIND_LABELS)} error={errorFor("kind")} />
        <SelectField label="Proje" name="projectId" options={[{ value: "", label: "Genel" }, ...projects.map((p) => ({ value: p.id, label: p.name }))]} error={errorFor("projectId")} />
      </div>
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Ekleniyor…" : "Dokümanı ekle"}</button>
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>Taslakta dosya yüklenmez; indirildiğinde örnek bir PDF oluşturulur.</p>
    </form>
  );
}

/** Saves as soon as a new stage is picked. */
export function StageForm({ action, stage }: { action: (formData: FormData) => Promise<void>; stage: ProjectStage }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={action} className="inline-form">
      <select className="input" name="stage" aria-label="Proje aşaması" defaultValue={stage} onChange={() => formRef.current?.requestSubmit()}>
        {Object.entries(STAGE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </form>
  );
}
