"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/auth/password";
import { endOtherSessions, getCurrentUser } from "@/lib/auth/session";
import { fieldErrors, success, text, type ActionState } from "@/lib/forms";

async function signedInUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Oturum bulunamadı.");
  return user;
}

const profileSchema = z.object({
  name: z.string().trim().min(2, { error: "Adınızı ve soyadınızı yazın." }).max(120),
  title: z.string().trim().max(80),
  phone: z.string().trim().max(40),
});

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await signedInUser();
  const parsed = profileSchema.safeParse({ name: text(formData, "name"), title: text(formData, "title"), phone: text(formData, "phone") });
  if (!parsed.success) return fieldErrors(parsed.error);
  const db = await getDb();
  await db
    .update(users)
    .set({ name: parsed.data.name, title: parsed.data.title || null, phone: parsed.data.phone || null })
    .where(eq(users.id, user.id));
  revalidatePath("/", "layout");
  return success("Profiliniz güncellendi.");
}

const passwordSchema = z
  .object({
    current: z.string().min(1, { error: "Mevcut şifrenizi yazın." }),
    password: z.string().min(MIN_PASSWORD_LENGTH, { error: `Yeni şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı.` }).max(200),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], error: "Şifreler aynı değil." });

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await signedInUser();
  const parsed = passwordSchema.safeParse({ current: text(formData, "current"), password: text(formData, "password"), confirm: text(formData, "confirm") });
  if (!parsed.success) return fieldErrors(parsed.error);

  const db = await getDb();
  const [row] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id));
  if (!row?.passwordHash || !(await verifyPassword(parsed.data.current, row.passwordHash))) {
    return { status: "error", fieldErrors: { current: "Mevcut şifre hatalı." } };
  }
  await db.update(users).set({ passwordHash: await hashPassword(parsed.data.password) }).where(eq(users.id, user.id));
  await endOtherSessions(user.id);
  return success("Şifreniz değiştirildi. Diğer oturumlarınız (GoTech Desk dahil) kapatıldı.");
}

export async function updateNotifications(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await signedInUser();
  const db = await getDb();
  await db.update(users).set({ notifyByEmail: formData.get("notifyByEmail") === "on" }).where(eq(users.id, user.id));
  revalidatePath("/", "layout");
  return success("Bildirim tercihiniz kaydedildi.");
}
