"use client";

import { useState } from "react";
import { DateField, FormMessage, SelectField, TextAreaField, TextField, toOptions } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { SERVICE_LABELS } from "@/features/projects/labels";
import type { ActionState } from "@/lib/forms";
import { AttachmentPicker } from "./AttachmentPicker";
import { Icon } from "./Icon";

type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;
type StaffMember = { id: string; name: string };

/** The assignee options; a project may have nobody responsible for it yet. */
export const assigneeOptions = (staff: StaffMember[]) => [{ value: "", label: "Atanmadı" }, ...staff.map((s) => ({ value: s.id, label: s.name }))];

/** The editable fields of a project, as the form submits them; the stage is set by the bar above the page. */
export type ProjectFormValues = { name: string; service: string; summary: string; assigneeId: string; startsOn: string; dueOn: string };

export function EditProjectForm({ action, values, staff }: { action: FormAction; values: ProjectFormValues; staff: StaffMember[] }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  return (
    <form className="card form-stack compact" onSubmit={onSubmit} noValidate>
      <h2>Projeyi düzenle</h2>
      <TextField label="Proje adı" name="name" defaultValue={values.name} error={errorFor("name")} />
      <div className="form-grid">
        <SelectField label="Hizmet" name="service" defaultValue={values.service} options={toOptions(SERVICE_LABELS)} error={errorFor("service")} />
        <SelectField label="Sorumlu" name="assigneeId" defaultValue={values.assigneeId} options={assigneeOptions(staff)} error={errorFor("assigneeId")} />
      </div>
      <div className="form-grid">
        <DateField label="Başlangıç" name="startsOn" defaultValue={values.startsOn} error={errorFor("startsOn")} />
        <DateField label="Hedef teslim" name="dueOn" defaultValue={values.dueOn} optional error={errorFor("dueOn")} />
      </div>
      <TextAreaField label="Kısa açıklama" name="summary" rows={3} defaultValue={values.summary} optional error={errorFor("summary")} />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Kaydet"}</button>
    </form>
  );
}

export function AddMilestoneForm({ action }: { action: FormAction }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  return (
    <form className="ms-add form-stack" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      <div className="form-grid">
        <TextField label="Yeni adım" name="title" placeholder="Örneğin: İçerik girişi" error={errorFor("title")} />
        <DateField label="Hedef tarih" name="dueOn" optional error={errorFor("dueOn")} />
      </div>
      <FormMessage state={state} />
      <button className="btn btn-ghost" type="submit" disabled={pending}>{pending ? "Ekleniyor…" : "Adım ekle"}</button>
    </form>
  );
}

/** Writes a progress note on the project, with files and an internal-only switch. */
export function ProjectUpdateComposer({ action, companyId }: { action: FormAction; companyId: string }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  const [uploading, setUploading] = useState(false);
  const error = errorFor("body");
  return (
    <form className="composer is-flat" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      <label className="sr-only" htmlFor="update-body">İlerleme notu</label>
      <textarea
        id="update-body"
        className={`input${error ? " is-invalid" : ""}`}
        name="body"
        rows={3}
        placeholder="Bu hafta ne yapıldı? Müşterinin bilmesi gereken bir şey var mı?"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "update-body-error" : undefined}
      />
      {error && <p className="field-error" id="update-body-error">{error}</p>}
      <AttachmentPicker companyId={companyId} onBusyChange={setUploading} />
      <label className="check-row"><input type="checkbox" name="internal" />İç not (müşteri görmez)</label>
      <FormMessage state={state} />
      <div className="composer-foot">
        <small>Notlar müşteri panelinde de görünür, iç notlar görünmez.</small>
        <button className="btn" type="submit" disabled={pending || uploading}>
          <Icon name="send" size={18} />
          {pending ? "Ekleniyor…" : uploading ? "Dosyalar yükleniyor…" : "Notu ekle"}
        </button>
      </div>
    </form>
  );
}
