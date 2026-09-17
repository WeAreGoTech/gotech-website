"use client";

import { useState } from "react";
import { FormMessage, SelectField, TextAreaField, TextField, toOptions } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/db/schema";
import { createTicket } from "@/features/tickets/actions";
import { CATEGORY_HINTS, CATEGORY_LABELS, NEW_TICKET_CATEGORIES, PRIORITY_LABELS, STATUS_LABELS } from "@/features/tickets/labels";
import type { ActionState } from "@/lib/forms";
import { AttachmentPicker } from "./AttachmentPicker";
import { CATEGORY_ICONS, Icon } from "./Icon";

type BoundAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export function NewTicketForm({ defaultCategory = "support" }: { defaultCategory?: TicketCategory }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(createTicket);
  const [uploading, setUploading] = useState(false);
  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate>
      <fieldset className="field">
        <legend>Ne ile ilgili?</legend>
        <div className="tiles">
          {NEW_TICKET_CATEGORIES.map((category) => (
            <label key={category} className="tile">
              <input type="radio" name="category" value={category} defaultChecked={category === defaultCategory} />
              <span>
                <span className="w-icon"><Icon name={CATEGORY_ICONS[category]} /></span>
                <span><strong>{CATEGORY_LABELS[category]}</strong><small>{CATEGORY_HINTS[category]}</small></span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <TextField label="Konu" name="subject" placeholder="Örneğin: Sipariş ekranında kaydet butonu çalışmıyor" error={errorFor("subject")} />
      <TextAreaField label="Ne oldu?" name="body" rows={6} placeholder="Hangi ekranda, ne yapmaya çalışırken oldu? Hata mesajı çıktıysa aynen yazın." error={errorFor("body")} />
      <div className="field">
        <span className="field-label">Dosyalar <span className="opt">(isteğe bağlı)</span></span>
        <AttachmentPicker onBusyChange={setUploading} />
      </div>
      <fieldset className="field">
        <legend>Ne kadar acil?</legend>
        <div className="segmented">
          {(Object.keys(PRIORITY_LABELS) as TicketPriority[]).map((priority, i) => (
            <label key={priority}><input type="radio" name="priority" value={priority} defaultChecked={i === 0} /><span>{PRIORITY_LABELS[priority]}</span></label>
          ))}
        </div>
      </fieldset>
      <FormMessage state={state} />
      <div className="form-actions">
        <span className="muted">Ekibimize e-posta ile de haber veriyoruz.</span>
        <SubmitButton pending={pending} uploading={uploading} label="Talebi gönder" />
      </div>
    </form>
  );
}

/** Message box under the conversation. The team can switch between a reply to the customer and an internal note. */
export function Composer({ action, allowInternal = false, closed = false, uploadCompanyId }: { action: BoundAction; allowInternal?: boolean; closed?: boolean; uploadCompanyId?: string }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  const [uploading, setUploading] = useState(false);
  const error = errorFor("body");
  return (
    <form className="composer" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      {closed && <p className="notice">Bu talep kapandı. Yazarsanız yeniden açılır.</p>}
      {allowInternal && (
        <div className="segmented" role="radiogroup" aria-label="Mesaj türü">
          <label><input type="radio" name="mode" value="reply" defaultChecked /><span>Müşteriye yanıt</span></label>
          <label><input type="radio" name="mode" value="note" /><span>İç not</span></label>
        </div>
      )}
      <label className="sr-only" htmlFor="composer-body">Mesaj</label>
      <textarea
        id="composer-body"
        className={`input${error ? " is-invalid" : ""}`}
        name="body"
        rows={3}
        placeholder="Mesajınızı yazın"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "composer-error" : undefined}
      />
      {error && <p className="field-error" id="composer-error">{error}</p>}
      <AttachmentPicker companyId={uploadCompanyId} onBusyChange={setUploading} />
      {state.status === "error" && <FormMessage state={state} />}
      <div className="composer-foot">
        <small>{allowInternal ? "Yanıt müşteriye e-posta ile de gider. İç not gitmez." : "Yanıtınız ekibimize bildirilir."}</small>
        <SubmitButton pending={pending} uploading={uploading} label="Gönder" />
      </div>
    </form>
  );
}

/** Send button that also waits for attachments still uploading. */
function SubmitButton({ pending, uploading, label }: { pending: boolean; uploading: boolean; label: string }) {
  return (
    <button className="btn" type="submit" disabled={pending || uploading}>
      <Icon name="send" size={18} />
      {pending ? "Gönderiliyor…" : uploading ? "Dosyalar yükleniyor…" : label}
    </button>
  );
}

type StaffMember = { id: string; name: string };
type TicketFields = { status: TicketStatus; priority: TicketPriority; assigneeId: string };

export function StaffTicketForm({ action, status, priority, assigneeId, staff }: { action: BoundAction; status: TicketStatus; priority: TicketPriority; assigneeId: string | null; staff: StaffMember[] }) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  const saved: TicketFields = { status, priority, assigneeId: assigneeId ?? "" };
  const [values, setValues] = useState(saved);
  const [lastSaved, setLastSaved] = useState(saved);
  // A reply on the page can change status or assignee; follow the server without remounting,
  // so the "saved" confirmation of this form stays visible.
  if (lastSaved.status !== saved.status || lastSaved.priority !== saved.priority || lastSaved.assigneeId !== saved.assigneeId) {
    setLastSaved(saved);
    setValues(saved);
  }
  const change = (field: keyof TicketFields) => (value: string) => setValues({ ...values, [field]: value });

  return (
    <form className="card form-stack compact" onSubmit={onSubmit} noValidate>
      <h2>Yönet</h2>
      <SelectField label="Durum" name="status" value={values.status} onValueChange={change("status")} options={toOptions(STATUS_LABELS.staff)} error={errorFor("status")} />
      <SelectField label="Öncelik" name="priority" value={values.priority} onValueChange={change("priority")} options={toOptions(PRIORITY_LABELS)} error={errorFor("priority")} />
      <SelectField
        label="Üstlenen"
        name="assigneeId"
        value={values.assigneeId}
        onValueChange={change("assigneeId")}
        options={[{ value: "", label: "Kimse üstlenmedi" }, ...staff.map((s) => ({ value: s.id, label: s.name }))]}
        error={errorFor("assigneeId")}
      />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Kaydet"}</button>
    </form>
  );
}
