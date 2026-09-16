import "server-only";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { companies, ticketMessages, tickets } from "@/db/schema";
import { SUBJECT_MAX } from "@/features/tickets/schemas";
import { sendMail } from "@/lib/mail/send";
import { newTicketMail } from "@/lib/mail/templates";
import type { AuthenticatedDevice } from "./device-auth";
import { formatDeskId } from "./labels";
import { findCompanyCustomer, findOldestCustomer } from "./people";

export type SupportRequestResult = { status: "no_customer_user" } | { status: "ok"; ticketNumber: number };

/** Opens a support ticket for the company of a computer, linked to that computer, as if its person had written it. */
export async function createSupportRequest(device: AuthenticatedDevice, message: string): Promise<SupportRequestResult> {
  const linked = device.userId ? await findCompanyCustomer(device.companyId, device.userId) : null;
  const author = linked ?? (await findOldestCustomer(device.companyId));
  if (!author) return { status: "no_customer_user" };

  const personName = linked?.name ?? device.contactName;
  const subject = `Uzak destek: ${device.label ?? personName ?? device.hostname}`.slice(0, SUBJECT_MAX).trim();
  const body = [
    message,
    "",
    "— GoTech Desk üzerinden gönderildi",
    `Bilgisayar: ${device.hostname} (${formatDeskId(device.deskId)})`,
    `Kişi: ${personName ?? "-"}`,
  ].join("\n");
  const fields = { subject, category: "support", priority: "normal" } as const;

  const db = await getDb();
  const ticket = await db.transaction(async (tx) => {
    const [created] = await tx.insert(tickets).values({ ...fields, companyId: device.companyId, createdById: author.id, deviceId: device.id }).returning();
    await tx.insert(ticketMessages).values({ ticketId: created.id, authorId: author.id, body });
    return created;
  });
  const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, device.companyId));

  await sendMail(newTicketMail({ ...ticket, companyName: company.name, authorName: author.name, body }));
  // same as the ticket actions: lists, dashboards and sidebar counts of both panels change
  revalidatePath("/panel", "layout");
  revalidatePath("/yonetim", "layout");
  return { status: "ok", ticketNumber: ticket.number };
}
