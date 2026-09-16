"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { companies, users } from "@/db/schema";
import { createPasswordLink, PASSWORD_LINK_HOURS } from "@/lib/auth/password-tokens";
import { requireStaff } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { sendMail } from "@/lib/mail/send";
import { inviteMail } from "@/lib/mail/templates";
import { newCustomerCode } from "./customer-code";

const NEW_COMPANY = "new";

const inviteSchema = z
  .object({
    companyId: z.union([z.uuid(), z.literal(NEW_COMPANY)], { error: "Firmayı seçin." }),
    companyName: z.string().trim().max(160),
    name: z.string().trim().min(2, { error: "Kişinin adını ve soyadını yazın." }).max(120),
    email: z.string().trim().toLowerCase().pipe(z.email({ error: "Geçerli bir e-posta adresi yazın." })),
  })
  .refine((v) => v.companyId !== NEW_COMPANY || v.companyName.length >= 2, {
    path: ["companyName"],
    error: "Yeni firmanın adını yazın.",
  });

async function sendInvite(user: { id: string; name: string; email: string }, companyName: string) {
  const link = await createPasswordLink(user.id);
  await sendMail(inviteMail({ to: user.email, name: user.name, companyName, link, validHours: PASSWORD_LINK_HOURS }));
}

export async function inviteCustomer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = inviteSchema.safeParse({
    companyId: text(formData, "companyId"),
    companyName: text(formData, "companyName"),
    name: text(formData, "name"),
    email: text(formData, "email"),
  });
  if (!parsed.success) return fieldErrors(parsed.error);
  const input = parsed.data;

  const db = await getDb();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email));
  if (existing) return { status: "error", fieldErrors: { email: "Bu e-posta ile kayıtlı bir kullanıcı zaten var." } };

  const company =
    input.companyId === NEW_COMPANY
      ? (await db.insert(companies).values({ name: input.companyName, customerCode: await newCustomerCode(db) }).returning())[0]
      : (await db.select().from(companies).where(eq(companies.id, input.companyId)))[0];
  if (!company) return failure("Seçilen firma bulunamadı.");

  const [user] = await db.insert(users).values({ name: input.name, email: input.email, role: "customer", companyId: company.id }).returning();
  await sendInvite(user, company.name);
  revalidatePath("/yonetim/musteriler");
  return success(`${user.name} için davet e-postası gönderildi.`);
}

export async function resendInvite(userId: string) {
  await requireStaff();
  const db = await getDb();
  const [row] = await db
    .select({ id: users.id, name: users.name, email: users.email, companyName: companies.name })
    .from(users)
    .innerJoin(companies, eq(companies.id, users.companyId))
    .where(and(eq(users.id, userId), eq(users.role, "customer")));
  if (!row) throw new Error("Müşteri bulunamadı.");
  await sendInvite(row, row.companyName);
  revalidatePath("/yonetim/mailler");
}
