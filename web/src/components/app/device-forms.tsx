"use client";

import { FormMessage, SelectField, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { CONTACT_NAME_MAX, LABEL_MAX } from "@/features/devices/labels";
import type { ActionState } from "@/lib/forms";

type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

type DeviceAssignmentFormProps = {
  action: FormAction;
  people: { id: string; name: string }[];
  userId: string | null;
  contactName: string | null;
  label: string | null;
};

/** Staff edits who uses a computer and its label; the desktop app picks the change up on its next heartbeat. */
export function DeviceAssignmentForm({ action, people, userId, contactName, label }: DeviceAssignmentFormProps) {
  const { state, pending, onSubmit, errorFor } = useFormAction(action);
  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate>
      <h2>Kişi ve etiket</h2>
      <SelectField
        label="Kişi (panel kullanıcısı)"
        name="userId"
        defaultValue={userId ?? ""}
        options={[{ value: "", label: "Kişi yok" }, ...people.map((p) => ({ value: p.id, label: p.name }))]}
        error={errorFor("userId")}
      />
      <TextField
        label="Kişinin adı"
        name="contactName"
        optional
        maxLength={CONTACT_NAME_MAX}
        defaultValue={contactName ?? ""}
        placeholder="Panel hesabı olmayan kişi için"
        error={errorFor("contactName")}
      />
      <TextField label="Etiket" name="label" optional maxLength={LABEL_MAX} defaultValue={label ?? ""} placeholder="Örneğin: Resepsiyon" error={errorFor("label")} />
      <FormMessage state={state} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Kaydediliyor…" : "Kaydet"}</button>
      <p className="muted" style={{ margin: 0, fontSize: ".88rem" }}>Listeden kişi seçilirse yazılan ad kullanılmaz. Etiket ortak bilgisayarlar içindir.</p>
    </form>
  );
}
