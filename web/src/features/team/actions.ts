"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { companies, leads, users, type UserRole } from "@/db/schema";
import { newCustomerCode } from "@/features/customers/customer-code";
import { createPasswordLink, PASSWORD_LINK_HOURS } from "@/lib/auth/password-tokens";
import { requireCustomer, requireStaff } from "@/lib/auth/session";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { sendMail } from "@/lib/mail/send";
import { inviteMail, staffInviteMail } from "@/lib/mail/templates";
import { changeMember, isFirstMember, MEMBER_ERRORS, noticeHref, TEAM_PAGE, type MemberChange } from "./membership";
import { changeStaff, STAFF_PAGE, type StaffChange } from "./staff-membership";

const personSchema = z.object({
  name: z.string().trim().min(2, { error: "Kişinin adını ve soyadını yazın." }).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Geçerli bir e-posta adresi yazın." })),
  title: z.string().trim().max(80),
});

type InviteResult = { ok: true; user: typeof users.$inferSelect; link: string } | { ok: false; reason: "taken" | "removed" };

async function createInvitedUser(
  input: z.infer<typeof personSchema>,
  role: UserRole,
  companyId: string | null,
  makeCompanyAdmin = false,
): Promise<InviteResult> {
  const db = await getDb();
  const [existing] = await db.select({ id: users.id, removedAt: users.removedAt }).from(users).where(eq(users.email, input.email));
  if (existing) return { ok: false, reason: existing.removedAt ? "removed" : "taken" };
  // asked for, or automatic for the company's first person, who would otherwise have nobody to manage them
  const isCompanyAdmin = role === "customer" && companyId !== null && (makeCompanyAdmin || (await isFirstMember(companyId)));
  const [user] = await db
    .insert(users)
    .values({ name: input.name, email: input.email, title: input.title || null, role, companyId, isCompanyAdmin })
    .returning();
  return { ok: true, user, link: await createPasswordLink(user.id) };
}

const EMAIL_TAKEN: ActionState = { status: "error", fieldErrors: { email: "Bu e-posta ile kayıtlı bir kullanıcı zaten var." } };
// a removed colleague is brought back from the "Çıkarılanlar" list instead of being invited again
const EMAIL_REMOVED: ActionState = { status: "error", fieldErrors: { email: "Bu kişi firmadan çıkarılmış. Aşağıdaki \"Çıkarılanlar\" listesinden geri alabilirsiniz." } };

const inviteProblem = (reason: "taken" | "removed") => (reason === "removed" ? EMAIL_REMOVED : EMAIL_TAKEN);

/** A customer adds a colleague to their own company. Only the firma yetkilisi may. */
export async function inviteColleague(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireCustomer();
  if (!me.isCompanyAdmin) return failure(MEMBER_ERRORS.notAdmin);
  const parsed = personSchema.safeParse({ name: text(formData, "name"), email: text(formData, "email"), title: text(formData, "title") });
  if (!parsed.success) return fieldErrors(parsed.error);

  const created = await createInvitedUser(parsed.data, "customer", me.companyId);
  if (!created.ok) return inviteProblem(created.reason);
  const db = await getDb();
  const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, me.companyId));
  await sendMail(inviteMail({ to: created.user.email, name: created.user.name, companyName: company.name, link: created.link, validHours: PASSWORD_LINK_HOURS }));
  revalidatePath("/panel/ekip");
  return success(`${created.user.name} davet edildi. Şifresini belirleyince panele girebilecek.`);
}

/** The three people controls on the Ekibim page; each one ends on that page, with a warning when refused. */
async function manageColleague(personId: string, change: MemberChange) {
  const me = await requireCustomer();
  if (!me.isCompanyAdmin) redirect(noticeHref(TEAM_PAGE, MEMBER_ERRORS.notAdmin));
  if (change === "remove" && personId === me.id) redirect(noticeHref(TEAM_PAGE, MEMBER_ERRORS.selfRemove));
  const error = await changeMember(me.companyId, personId, change);
  redirect(error ? noticeHref(TEAM_PAGE, error) : TEAM_PAGE);
}

export async function promoteColleague(personId: string) {
  await manageColleague(personId, "promote");
}

export async function demoteColleague(personId: string) {
  await manageColleague(personId, "demote");
}

export async function removeColleague(personId: string) {
  await manageColleague(personId, "remove");
}

export async function restoreColleague(personId: string) {
  await manageColleague(personId, "restore");
}

/** The Ekip page's remove and restore buttons for GoTech's own people; a refusal comes back as a warning. */
async function manageStaff(personId: string, change: StaffChange) {
  const me = await requireStaff();
  const error = await changeStaff(me.id, personId, change);
  redirect(error ? noticeHref(STAFF_PAGE, error) : STAFF_PAGE);
}

export async function removeStaffMember(personId: string) {
  await manageStaff(personId, "remove");
}

export async function restoreStaffMember(personId: string) {
  await manageStaff(personId, "restore");
}

// Staff invite people from one form, choosing whether the person joins GoTech or a customer company.
const invitePersonSchema = personSchema.extend({
  role: z.enum(["staff", "customer"]),
  companyId: z.string().trim(),
  companyAdmin: z.boolean(),
});

export async function invitePerson(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const parsed = invitePersonSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    title: text(formData, "title"),
    role: text(formData, "role") || "staff",
    companyId: text(formData, "companyId"),
    companyAdmin: formData.get("companyAdmin") !== null,
  });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { role, companyId, companyAdmin, ...person } = parsed.data;

  if (role === "customer" && !companyId) {
    return { status: "error", fieldErrors: { companyId: "Kişinin ekleneceği firmayı seçin." } };
  }
  const db = await getDb();
  const [company] = companyId ? await db.select({ name: companies.name }).from(companies).where(eq(companies.id, companyId)).limit(1) : [];
  if (role === "customer" && !company) return failure("Seçilen firma bulunamadı.");

  const created = await createInvitedUser(person, role, role === "customer" ? companyId : null, companyAdmin);
  if (!created.ok) return inviteProblem(created.reason);

  const { email: to, name } = created.user;
  await sendMail(
    role === "staff"
      ? staffInviteMail({ to, name, invitedBy: me.name, link: created.link, validHours: PASSWORD_LINK_HOURS })
      : inviteMail({ to, name, companyName: company!.name, link: created.link, validHours: PASSWORD_LINK_HOURS }),
  );
  revalidatePath(role === "staff" ? "/yonetim/ekip" : "/yonetim/musteriler");
  return success(role === "staff" ? `${name} ekibe davet edildi.` : `${name}, ${company!.name} firmasına davet edildi.`);
}

/** Turns a contact form submission into a customer company and invites the person who wrote. */
export async function convertLeadToCustomer(leadId: string) {
  await requireStaff();
  const db = await getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  if (!lead) throw new Error("Başvuru bulunamadı.");

  const [company] = await db.insert(companies).values({ name: lead.company || lead.name, customerCode: await newCustomerCode(db) }).returning();
  const created = await createInvitedUser({ name: lead.name, email: lead.email, title: "" }, "customer", company.id);
  if (created.ok) {
    await sendMail(inviteMail({ to: lead.email, name: lead.name, companyName: company.name, link: created.link, validHours: PASSWORD_LINK_HOURS }));
  }
  await db.update(leads).set({ status: "won" }).where(eq(leads.id, leadId));

  revalidatePath("/yonetim", "layout");
  redirect(`/yonetim/musteriler/${company.id}`);
}
