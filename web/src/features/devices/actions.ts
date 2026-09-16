"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { devices } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";

export async function removeDevice(deviceId: string) {
  await requireStaff();
  const db = await getDb();
  const [removed] = await db.delete(devices).where(eq(devices.id, deviceId)).returning({ companyId: devices.companyId });
  if (!removed) return;
  revalidatePath("/yonetim/cihazlar");
  revalidatePath(`/yonetim/musteriler/${removed.companyId}`);
  revalidatePath("/panel/uzak-destek");
}
