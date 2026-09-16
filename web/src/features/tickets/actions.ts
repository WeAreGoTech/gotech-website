"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { companies, ticketMessages, tickets, users } from "@/db/schema";
import { requireCustomer, requireStaff } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { failure, fieldErrors, success, text, type ActionState } from "@/lib/forms";
import { sendMail } from "@/lib/mail/send";
import { customerReplyMail, newTicketMail, staffReplyMail } from "@/lib/mail/templates";
import { getCompanyTicket, getStaffTicket } from "./queries";
import { newTicketSchema, ratingSchema, replySchema, staffUpdateSchema } from "./schemas";

const NOT_FOUND = "Talep bulunamadı.";

// tickets show up in lists, dashboards and sidebar counts, so refresh both panels entirely
function revalidateTicket() {
  revalidatePath("/panel", "layout");
  revalidatePath("/yonetim", "layout");
}

export async function createTicket(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireCustomer();
  const parsed = newTicketSchema.safeParse({
    subject: text(formData, "subject"),
    category: text(formData, "category"),
    priority: text(formData, "priority"),
    body: text(formData, "body"),
  });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { body, ...fields } = parsed.data;

  const db = await getDb();
  const ticket = await db.transaction(async (tx) => {
    const [created] = await tx.insert(tickets).values({ ...fields, companyId: user.companyId, createdById: user.id }).returning();
    await tx.insert(ticketMessages).values({ ticketId: created.id, authorId: user.id, body });
    return created;
  });
  const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, user.companyId));

  await sendMail(newTicketMail({ ...ticket, companyName: company.name, authorName: user.name, body }));
  revalidateTicket();
  redirect(`/panel/talep/${ticket.number}`);
}

export async function replyAsCustomer(ticketNumber: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireCustomer();
  const parsed = replySchema.safeParse({ body: text(formData, "body"), internal: false });
  if (!parsed.success) return fieldErrors(parsed.error);
  const ticket = await getCompanyTicket(ticketNumber, user.companyId);
  if (!ticket) return failure(NOT_FOUND);

  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.insert(ticketMessages).values({ ticketId: ticket.id, authorId: user.id, body: parsed.data.body });
    // a customer reply always puts the ticket back in the team's queue, including closed ones
    await tx.update(tickets).set({ status: "open", updatedAt: new Date() }).where(eq(tickets.id, ticket.id));
  });

  const staffView = await getStaffTicket(ticketNumber);
  if (staffView) {
    await sendMail(
      customerReplyMail({
        ...ticket,
        to: staffView.assigneeEmail ?? env.notifyEmail,
        customerName: user.name,
        companyName: staffView.companyName,
        body: parsed.data.body,
      }),
    );
  }
  revalidateTicket();
  return success();
}

export async function closeTicketAsCustomer(ticketNumber: number) {
  const user = await requireCustomer();
  const ticket = await getCompanyTicket(ticketNumber, user.companyId);
  if (!ticket) throw new Error(NOT_FOUND);
  const db = await getDb();
  await db.update(tickets).set({ status: "closed", updatedAt: new Date() }).where(eq(tickets.id, ticket.id));
  revalidateTicket();
}

export async function replyAsStaff(ticketNumber: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const staff = await requireStaff();
  const parsed = replySchema.safeParse({ body: text(formData, "body"), internal: text(formData, "mode") === "note" });
  if (!parsed.success) return fieldErrors(parsed.error);
  const row = await getStaffTicket(ticketNumber);
  if (!row) return failure(NOT_FOUND);
  const { ticket } = row;
  const { body, internal } = parsed.data;

  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.insert(ticketMessages).values({ ticketId: ticket.id, authorId: staff.id, body, isInternal: internal });
    const publicReply = internal ? {} : { status: "waiting_customer" as const };
    // whoever answers an unassigned ticket takes it
    const claim = ticket.assigneeId ? {} : { assigneeId: staff.id };
    await tx.update(tickets).set({ ...publicReply, ...claim, updatedAt: new Date() }).where(eq(tickets.id, ticket.id));
  });

  if (!internal && row.creatorNotify) {
    await sendMail(staffReplyMail({ ...ticket, to: row.creatorEmail, recipientName: row.creatorName, staffName: staff.name, body }));
  }
  revalidateTicket();
  return success(internal ? "İç not eklendi." : "Yanıt gönderildi.");
}

export async function updateTicketAsStaff(ticketNumber: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const parsed = staffUpdateSchema.safeParse({
    status: text(formData, "status"),
    priority: text(formData, "priority"),
    assigneeId: text(formData, "assigneeId"),
  });
  if (!parsed.success) return fieldErrors(parsed.error);
  const { assigneeId, ...fields } = parsed.data;

  const db = await getDb();
  if (assigneeId) {
    const [member] = await db.select({ role: users.role }).from(users).where(eq(users.id, assigneeId));
    if (member?.role !== "staff") return failure("Talep yalnızca ekip üyelerine atanabilir.");
  }
  const updated = await db
    .update(tickets)
    .set({ ...fields, assigneeId: assigneeId || null, updatedAt: new Date() })
    .where(eq(tickets.number, ticketNumber))
    .returning({ id: tickets.id });
  if (updated.length === 0) return failure(NOT_FOUND);

  revalidateTicket();
  return success("Değişiklikler kaydedildi.");
}

export async function rateTicket(ticketNumber: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireCustomer();
  const parsed = ratingSchema.safeParse({ rating: text(formData, "rating"), comment: text(formData, "comment") });
  if (!parsed.success) return fieldErrors(parsed.error);
  const ticket = await getCompanyTicket(ticketNumber, user.companyId);
  if (!ticket) return failure(NOT_FOUND);
  if (ticket.status !== "closed") return failure("Yalnızca kapanan talepler puanlanabilir.");

  const db = await getDb();
  await db
    .update(tickets)
    .set({ rating: parsed.data.rating, ratingComment: parsed.data.comment || null })
    .where(eq(tickets.id, ticket.id));
  revalidateTicket();
  return success("Teşekkürler, değerlendirmeniz ekibimize iletildi.");
}
