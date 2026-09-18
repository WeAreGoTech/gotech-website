"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/auth/password";
import { createPasswordLink, findUsablePasswordToken, markPasswordTokenUsed, PASSWORD_LINK_HOURS } from "@/lib/auth/password-tokens";
import { endSession, homeFor, startSession } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { sendMail } from "@/lib/mail/send";
import { passwordResetMail } from "@/lib/mail/templates";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

const LOGIN_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 15 * 60_000;
const RESET_ATTEMPTS_PER_EMAIL = 3;
const RESET_ATTEMPTS_PER_IP = 10;
const RESET_SENT = "Bu e-postayla bir hesap varsa şifre yenileme bağlantısını gönderdik. Birkaç dakika içinde gelmezse GoTech'e yazın.";
const WRONG_CREDENTIALS = "E-posta ya da şifre hatalı.";
const REMOVED_ACCOUNT = "Bu hesap firmanızdan çıkarıldı. Firma yetkilinizle görüşün.";
// compared against when the e-mail is unknown, so both cases take the same time
const DUMMY_HASH = hashPassword("gotech-timing-equalizer");

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Geçerli bir e-posta adresi yazın." })),
  password: z.string().min(1, { error: "Şifrenizi yazın." }),
});

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: text(formData, "email"), password: text(formData, "password") });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { email, password } = parsed.data;

  if (isRateLimited(`login:${await clientIp()}:${email}`, LOGIN_ATTEMPTS, LOGIN_WINDOW_MS)) {
    return failure("Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.");
  }

  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const valid = await verifyPassword(password, user?.passwordHash ?? (await DUMMY_HASH));
  if (!user?.passwordHash || !valid) return failure(WRONG_CREDENTIALS);
  // checked after the password so a wrong guess still cannot tell the two cases apart
  if (user.removedAt) return failure(REMOVED_ACCOUNT);

  await startSession(user.id);
  redirect(homeFor(user.role));
}

export async function logout() {
  await endSession();
  redirect("/giris");
}

const setPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(MIN_PASSWORD_LENGTH, { error: `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı.` }).max(200),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], error: "Şifreler aynı değil." });

export async function setPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = setPasswordSchema.safeParse({
    token: text(formData, "token"),
    password: text(formData, "password"),
    confirm: text(formData, "confirm"),
  });
  if (!parsed.success) return fieldErrors(parsed.error);

  const token = await findUsablePasswordToken(parsed.data.token);
  if (!token) return failure("Bu bağlantının süresi dolmuş ya da daha önce kullanılmış. \"Şifremi unuttum\" ile yenisini isteyin.");

  const db = await getDb();
  const [user] = await db
    .update(users)
    .set({ passwordHash: await hashPassword(parsed.data.password) })
    .where(eq(users.id, token.userId))
    .returning({ id: users.id, role: users.role });
  await markPasswordTokenUsed(token.id);
  // a new password ends every session the old one opened, the desktop app's included
  await db.delete(sessions).where(eq(sessions.userId, user.id));

  await startSession(user.id);
  redirect(homeFor(user.role));
}

const resetSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Geçerli bir e-posta adresi yazın." })),
});

/** Mails a link to set a new password; also how an invited person who lost the invite gets one. */
export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetSchema.safeParse({ email: text(formData, "email") });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { email } = parsed.data;

  const ip = await clientIp();
  if (isRateLimited(`reset:${ip}`, RESET_ATTEMPTS_PER_IP, LOGIN_WINDOW_MS) || isRateLimited(`reset:${ip}:${email}`, RESET_ATTEMPTS_PER_EMAIL, LOGIN_WINDOW_MS)) {
    return failure("Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.");
  }

  const db = await getDb();
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(and(eq(users.email, email), isNull(users.removedAt)))
    .limit(1);
  if (user) {
    await sendMail(passwordResetMail({ to: user.email, name: user.name, link: await createPasswordLink(user.id), validHours: PASSWORD_LINK_HOURS }));
  }
  // the same answer either way, so the form cannot tell anyone who has an account
  return success(RESET_SENT);
}
