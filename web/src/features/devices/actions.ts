"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { devices } from "@/db/schema";
import { requireCustomer, requireStaff } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { CONTACT_NAME_MAX, deviceHref, LABEL_MAX } from "./labels";
import { findCompanyCustomer } from "./people";

const DEVICE_NOT_FOUND = "Cihaz bulunamadı.";

function revalidateDevice(deviceId: string, companyId: string) {
  revalidatePath("/yonetim/cihazlar");
  revalidatePath(deviceHref(deviceId));
  revalidatePath(`/yonetim/musteriler/${companyId}`);
  revalidatePath("/panel/uzak-destek");
  revalidatePath("/panel/ekip");
}

export async function removeDevice(deviceId: string, backToList = false) {
  await requireStaff();
  const db = await getDb();
  const [removed] = await db.delete(devices).where(eq(devices.id, deviceId)).returning({ companyId: devices.companyId });
  if (!removed) return;
  revalidateDevice(deviceId, removed.companyId);
  // the detail page of a removed device would only show "not found"
  if (backToList) redirect("/yonetim/cihazlar");
}

const assignmentSchema = z.object({
  userId: z.union([z.uuid(), z.literal("")], { error: "Kişiyi listeden seçin." }),
  contactName: z.string().trim().max(CONTACT_NAME_MAX, { error: `İsim en fazla ${CONTACT_NAME_MAX} karakter olabilir.` }),
  label: z.string().trim().max(LABEL_MAX, { error: `Etiket en fazla ${LABEL_MAX} karakter olabilir.` }),
});

/** Staff sets who uses a computer and its label. */
export async function updateDeviceAssignment(deviceId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = assignmentSchema.safeParse({ userId: text(formData, "userId"), contactName: text(formData, "contactName"), label: text(formData, "label") });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { userId, contactName, label } = parsed.data;
  if (!z.uuid().safeParse(deviceId).success) return failure(DEVICE_NOT_FOUND);

  const db = await getDb();
  const [device] = await db.select({ companyId: devices.companyId }).from(devices).where(eq(devices.id, deviceId));
  if (!device) return failure(DEVICE_NOT_FOUND);
  if (userId && !(await findCompanyCustomer(device.companyId, userId))) {
    return { status: "error", fieldErrors: { userId: "Seçilen kişi bu firmada bulunamadı." } };
  }

  await db
    .update(devices)
    // same rule as registration in the app: a panel user wins over a typed name
    .set({ userId: userId || null, contactName: userId ? null : contactName || null, label: label || null })
    .where(eq(devices.id, deviceId));
  revalidateDevice(deviceId, device.companyId);
  return success("Cihaz bilgileri kaydedildi.");
}

/** A customer marks an unassigned computer of their company as their own. */
export async function claimDevice(deviceId: string) {
  const me = await requireCustomer();
  if (!z.uuid().safeParse(deviceId).success) return;
  const db = await getDb();
  const claimed = await db
    .update(devices)
    .set({ userId: me.id, contactName: null })
    .where(and(eq(devices.id, deviceId), eq(devices.companyId, me.companyId), isNull(devices.userId)))
    .returning({ id: devices.id });
  if (claimed.length > 0) revalidateDevice(deviceId, me.companyId);
}

/**
 * A customer signs one of their own computers out from the panel, e.g. a lost laptop or one that changed hands. The
 * registration is dropped as "Çıkış yap" in the app would do; the app notices at its next heartbeat and forgets it too.
 */
export async function signOutMyDevice(deviceId: string) {
  const me = await requireCustomer();
  if (!z.uuid().safeParse(deviceId).success) return;
  const db = await getDb();
  const removed = await db
    .delete(devices)
    .where(and(eq(devices.id, deviceId), eq(devices.companyId, me.companyId), eq(devices.userId, me.id)))
    .returning({ id: devices.id });
  if (removed.length > 0) revalidateDevice(deviceId, me.companyId);
}
