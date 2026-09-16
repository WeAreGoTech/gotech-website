"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { companies, leads, users, type UserRole } from "@/db/schema";
import { createPasswordLink, PASSWORD_LINK_HOURS } from "@/lib/auth/password-tokens";
import { requireCustomer, requireStaff } from "@/lib/auth/session";
import { fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { sendMail } from "@/lib/mail/send";
import { inviteMail, staffInviteMail } from "@/lib/mail/templates";

const personSchema = z.object({
  name: z.string().trim().min(2, { error: "Kişinin adını ve soyadını yazın." }).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Geçerli bir e-posta adresi yazın." })),
  title: z.string().trim().max(80),
});

async function createInvitedUser(input: z.infer<typeof personSchema>, role: UserRole, companyId: string | null) {
  const db = await getDb();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email));
  if (existing) return null;
  const [user] = await db.insert(users).values({ name: input.name, email: input.email, title: input.title || null, role, companyId }).returning();
  return { user, link: await createPasswordLink(user.id) };
}

const EMAIL_TAKEN: ActionState = { status: "error", fieldErrors: { email: "Bu e-posta ile kayıtlı bir kullanıcı zaten var." } };

/** A customer adds a colleague to their own company. */
export async function inviteColleague(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireCustomer();
  const parsed = personSchema.safeParse({ name: text(formData, "name"), email: text(formData, "email"), title: text(formData, "title") });
  if (!parsed.success) return fieldErrors(parsed.error);

  const created = await createInvitedUser(parsed.data, "customer", me.companyId);
  if (!created) return EMAIL_TAKEN;
  const db = await getDb();
  const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, me.companyId));
  await sendMail(inviteMail({ to: created.user.email, name: created.user.name, companyName: company.name, link: created.link, validHours: PASSWORD_LINK_HOURS }));
  revalidatePath("/panel/ekip");
  return success(`${created.user.name} davet edildi. Şifresini belirleyince panele girebilecek.`);
}

export async function inviteStaff(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const parsed = personSchema.safeParse({ name: text(formData, "name"), email: text(formData, "email"), title: text(formData, "title") });
  if (!parsed.success) return fieldErrors(parsed.error);

  const created = await createInvitedUser(parsed.data, "staff", null);
  if (!created) return EMAIL_TAKEN;
  await sendMail(staffInviteMail({ to: created.user.email, name: created.user.name, invitedBy: me.name, link: created.link, validHours: PASSWORD_LINK_HOURS }));
  revalidatePath("/yonetim/ekip");
  return success(`${created.user.name} ekibe davet edildi.`);
}

/** Turns a contact form submission into a customer company and invites the person who wrote. */
export async function convertLeadToCustomer(leadId: string) {
  await requireStaff();
  const db = await getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  if (!lead) throw new Error("Başvuru bulunamadı.");

  const [company] = await db.insert(companies).values({ name: lead.company || lead.name }).returning();
  const created = await createInvitedUser({ name: lead.name, email: lead.email, title: "" }, "customer", company.id);
  if (created) {
    await sendMail(inviteMail({ to: lead.email, name: lead.name, companyName: company.name, link: created.link, validHours: PASSWORD_LINK_HOURS }));
  }
  await db.update(leads).set({ status: "won" }).where(eq(leads.id, leadId));

  revalidatePath("/yonetim", "layout");
  redirect(`/yonetim/musteriler/${company.id}`);
}
