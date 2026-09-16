"use server";

import { and, eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { companies, invoiceLines, invoices, projects, users } from "@/db/schema";
import { requireStaff } from "@/lib/auth/session";
import { dayOffset } from "@/lib/dates";
import { failure, text, type ActionState } from "@/lib/forms";
import { sendMail } from "@/lib/mail/send";
import { newInvoiceMail } from "@/lib/mail/templates";
import { INVOICE_PAYMENT_DAYS, lineTotal, parseMoney, withVat } from "./calc";

const MAX_LINES = 8;
const headerSchema = z.object({
  companyId: z.uuid({ error: "Firmayı seçin." }),
  projectId: z.union([z.uuid(), z.literal("")]),
  dueDays: z.coerce.number().int().min(0).max(120),
  note: z.string().trim().max(300),
});

type Line = { description: string; quantity: number; unitPrice: number };

function readLines(formData: FormData): { lines: Line[]; error?: string } {
  const descriptions = formData.getAll("lineDescription").map(String);
  const quantities = formData.getAll("lineQuantity").map(String);
  const prices = formData.getAll("linePrice").map(String);
  const lines: Line[] = [];
  for (let i = 0; i < Math.min(descriptions.length, MAX_LINES); i++) {
    const description = descriptions[i].trim();
    if (!description && !prices[i]?.trim()) continue;
    const quantity = Number(quantities[i]);
    const unitPrice = parseMoney(prices[i] ?? "");
    if (!description || !Number.isInteger(quantity) || quantity < 1 || unitPrice === null) {
      return { lines, error: `${i + 1}. kalemde açıklama, adet ve birim fiyatı kontrol edin.` };
    }
    lines.push({ description, quantity, unitPrice });
  }
  return lines.length ? { lines } : { lines, error: "En az bir fatura kalemi girin." };
}

async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const db = await getDb();
  const rows = await db.select({ number: invoices.number }).from(invoices).where(like(invoices.number, `GT-${year}-%`));
  const highest = rows.reduce((max, r) => Math.max(max, Number(r.number.split("-")[2]) || 0), 0);
  return `GT-${year}-${String(highest + 1).padStart(4, "0")}`;
}

export async function createInvoice(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const header = headerSchema.safeParse({
    companyId: text(formData, "companyId"),
    projectId: text(formData, "projectId"),
    dueDays: text(formData, "dueDays") || INVOICE_PAYMENT_DAYS,
    note: text(formData, "note"),
  });
  if (!header.success) return failure("Firma ve vade bilgisini kontrol edin.");
  const { lines, error } = readLines(formData);
  if (error) return failure(error);
  const input = header.data;

  const db = await getDb();
  const [company] = await db.select().from(companies).where(eq(companies.id, input.companyId));
  if (!company) return failure("Firma bulunamadı.");
  if (input.projectId) {
    const [project] = await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, input.projectId), eq(projects.companyId, company.id)));
    if (!project) return failure("Seçilen proje bu firmaya ait değil.");
  }

  const number = await nextInvoiceNumber();
  const dueOn = dayOffset(input.dueDays);
  await db.transaction(async (tx) => {
    const [invoice] = await tx
      .insert(invoices)
      .values({ number, companyId: company.id, projectId: input.projectId || null, issuedOn: dayOffset(0), dueOn, note: input.note || null })
      .returning();
    await tx.insert(invoiceLines).values(lines.map((line, position) => ({ ...line, invoiceId: invoice.id, position })));
  });

  const { total } = withVat(lines.reduce((sum, l) => sum + lineTotal(l), 0));
  const recipients = await db.select({ name: users.name, email: users.email }).from(users).where(and(eq(users.companyId, company.id), eq(users.notifyByEmail, true)));
  for (const person of recipients) await sendMail(newInvoiceMail({ to: person.email, name: person.name, number, total, dueOn }));

  revalidatePath("/yonetim/faturalar");
  redirect(`/yonetim/faturalar/${number}`);
}

async function setStatus(invoiceId: string, status: "paid" | "cancelled" | "pending") {
  await requireStaff();
  const db = await getDb();
  const [invoice] = await db
    .update(invoices)
    .set({ status, paidAt: status === "paid" ? new Date() : null })
    .where(eq(invoices.id, invoiceId))
    .returning({ number: invoices.number });
  if (!invoice) throw new Error("Fatura bulunamadı.");
  revalidatePath(`/yonetim/faturalar/${invoice.number}`);
  revalidatePath("/yonetim", "layout");
  revalidatePath("/panel", "layout");
}

export async function markInvoicePaid(invoiceId: string) {
  await setStatus(invoiceId, "paid");
}

export async function cancelInvoice(invoiceId: string) {
  await setStatus(invoiceId, "cancelled");
}

export async function reopenInvoice(invoiceId: string) {
  await setStatus(invoiceId, "pending");
}
