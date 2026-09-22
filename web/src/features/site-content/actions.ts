"use server";

import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { DEFAULT_SITE_CONTENT, DEFAULT_SITE_SETTINGS } from "@/components/kurumsal/content";
import { getDb } from "@/db";
import { siteTexts } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { failure, success, text, type ActionState } from "@/lib/forms";

const EDITABLE_KEYS = [...Object.keys(DEFAULT_SITE_SETTINGS), ...Object.keys(DEFAULT_SITE_CONTENT)];
const MAX_TEXT_LENGTH = 2000;

export async function saveSiteTexts(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();

  const rows: { key: string; value: string }[] = [];
  for (const key of EDITABLE_KEYS) {
    // formda olmayan alan dokunulmadan kalsın
    if (!formData.has(key)) continue;
    const value = text(formData, key).trim();
    if (value.length > MAX_TEXT_LENGTH) return failure(`"${key}" alanı çok uzun.`);
    rows.push({ key, value });
  }
  if (rows.length === 0) return failure("Kaydedilecek bir alan gelmedi.");

  const db = await getDb();
  await db
    .insert(siteTexts)
    .values(rows)
    .onConflictDoUpdate({ target: siteTexts.key, set: { value: sql`excluded.value`, updatedAt: new Date() } });

  revalidatePath("/yonetim/site");
  return success("Site içeriği kaydedildi.");
}
