"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { staffDevices } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { LABEL_MAX, STAFF_DESK_ID_HINT, STAFF_DESK_ID_PATTERN } from "./labels";

const LABEL_MIN = 2;
const DESK_ID_TAKEN = "Bu ID başka bir ekip üyesinde kayıtlı.";

function revalidateStaffDevices() {
  revalidatePath("/yonetim/hesap");
  revalidatePath("/yonetim/ekip");
}

const staffDeviceSchema = z.object({
  label: z
    .string()
    .trim()
    .min(LABEL_MIN, { error: "Bilgisayara bir ad verin, örneğin: Ofis masaüstü." })
    .max(LABEL_MAX, { error: `Ad en fazla ${LABEL_MAX} karakter olabilir.` }),
  deskId: z.string().regex(STAFF_DESK_ID_PATTERN, { error: STAFF_DESK_ID_HINT }),
});

/** A team member adds one of their own computers to the list customers may be locked to. */
export async function addStaffDevice(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireStaff();
  // the ID is shown grouped ("201 369 773"), so spaces pasted back in are not an error
  const parsed = staffDeviceSchema.safeParse({ label: text(formData, "label"), deskId: text(formData, "deskId").replace(/\s/g, "") });
  if (!parsed.success) return fieldErrors(parsed.error);

  const db = await getDb();
  const [taken] = await db.select({ id: staffDevices.id }).from(staffDevices).where(eq(staffDevices.deskId, parsed.data.deskId));
  if (taken) return { status: "error", fieldErrors: { deskId: DESK_ID_TAKEN } };

  await db.insert(staffDevices).values({ userId: me.id, ...parsed.data });
  revalidateStaffDevices();
  return success("Bilgisayar eklendi.");
}

/** Removes one of the signed-in team member's own computers. */
export async function removeStaffDevice(staffDeviceId: string) {
  const me = await requireStaff();
  if (!z.uuid().safeParse(staffDeviceId).success) return;
  const db = await getDb();
  const removed = await db
    .delete(staffDevices)
    .where(and(eq(staffDevices.id, staffDeviceId), eq(staffDevices.userId, me.id)))
    .returning({ id: staffDevices.id });
  if (removed.length > 0) revalidateStaffDevices();
}
