"use client";

import { FormMessage, TextField } from "@/components/forms/fields";
import { useFormAction } from "@/components/forms/use-form-action";
import { LABEL_MAX, STAFF_DESK_ID_HINT } from "@/features/devices/labels";
import { addStaffDevice } from "@/features/devices/staff-device-actions";

/** Adds one of the signed-in team member's own GoTech Desk computers. */
export function AddStaffDeviceForm() {
  const { state, pending, onSubmit, errorFor } = useFormAction(addStaffDevice);
  return (
    <form className="form-stack" onSubmit={onSubmit} noValidate key={state.submittedAt}>
      <div className="form-grid">
        <TextField label="Bilgisayar adı" name="label" maxLength={LABEL_MAX} placeholder="Örneğin: Ofis masaüstü" autoComplete="off" error={errorFor("label")} />
        <TextField label="GoTech Desk ID" name="deskId" inputMode="numeric" placeholder="201 369 773" autoComplete="off" error={errorFor("deskId")} />
      </div>
      <FormMessage state={state} />
      <div className="form-actions">
        <span className="muted">{STAFF_DESK_ID_HINT}</span>
        <button className="btn" type="submit" disabled={pending}>{pending ? "Ekleniyor…" : "Bilgisayar ekle"}</button>
      </div>
    </form>
  );
}
