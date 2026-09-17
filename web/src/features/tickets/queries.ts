import "server-only";
import { and, asc, count, desc, eq, ne, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import { companies, ticketMessages, tickets, users, type TicketStatus } from "@/db/schema";

const assignee = alias(users, "assignee");
const creator = alias(users, "creator");

const listColumns = {
  id: tickets.id,
  number: tickets.number,
  subject: tickets.subject,
  status: tickets.status,
  priority: tickets.priority,
  category: tickets.category,
  deviceId: tickets.deviceId,
  updatedAt: tickets.updatedAt,
};

export async function listCompanyTickets(companyId: string) {
  const db = await getDb();
  return db.select(listColumns).from(tickets).where(eq(tickets.companyId, companyId)).orderBy(desc(tickets.updatedAt));
}

export const STAFF_FILTERS = ["active", "open", "in_progress", "waiting_customer", "closed", "all"] as const;
export type StaffFilter = (typeof STAFF_FILTERS)[number];

function staffFilterWhere(filter: StaffFilter): SQL | undefined {
  if (filter === "all") return undefined;
  if (filter === "active") return ne(tickets.status, "closed");
  return eq(tickets.status, filter);
}

export async function listStaffTickets(filter: StaffFilter) {
  const db = await getDb();
  return db
    .select({ ...listColumns, companyName: companies.name, assigneeName: assignee.name })
    .from(tickets)
    .innerJoin(companies, eq(companies.id, tickets.companyId))
    .leftJoin(assignee, eq(assignee.id, tickets.assigneeId))
    .where(staffFilterWhere(filter))
    .orderBy(desc(tickets.updatedAt));
}

export async function countTicketsByStatus(): Promise<Record<TicketStatus, number>> {
  const db = await getDb();
  const rows = await db.select({ status: tickets.status, value: count() }).from(tickets).groupBy(tickets.status);
  const counts: Record<TicketStatus, number> = { open: 0, in_progress: 0, waiting_customer: 0, closed: 0 };
  for (const row of rows) counts[row.status] = row.value;
  return counts;
}

/** Not-closed tickets per company id; companies without any are missing from the map. */
export async function countOpenTicketsByCompany(): Promise<Map<string, number>> {
  const db = await getDb();
  const rows = await db.select({ companyId: tickets.companyId, value: count() }).from(tickets).where(ne(tickets.status, "closed")).groupBy(tickets.companyId);
  return new Map(rows.map((r) => [r.companyId, r.value]));
}

export async function getCompanyTicket(number: number, companyId: string) {
  const db = await getDb();
  const [ticket] = await db
    .select()
    .from(tickets)
    .where(and(eq(tickets.number, number), eq(tickets.companyId, companyId)))
    .limit(1);
  return ticket ?? null;
}

export async function getStaffTicket(number: number) {
  const db = await getDb();
  const [row] = await db
    .select({
      ticket: tickets,
      companyName: companies.name,
      creatorName: creator.name,
      creatorEmail: creator.email,
      creatorNotify: creator.notifyByEmail,
      assigneeEmail: assignee.email,
    })
    .from(tickets)
    .innerJoin(companies, eq(companies.id, tickets.companyId))
    .innerJoin(creator, eq(creator.id, tickets.createdById))
    .leftJoin(assignee, eq(assignee.id, tickets.assigneeId))
    .where(eq(tickets.number, number))
    .limit(1);
  return row ?? null;
}

export async function listTicketMessages(ticketId: string, { includeInternal }: { includeInternal: boolean }) {
  const db = await getDb();
  const visibility = includeInternal ? undefined : eq(ticketMessages.isInternal, false);
  return db
    .select({
      id: ticketMessages.id,
      authorId: ticketMessages.authorId,
      body: ticketMessages.body,
      isInternal: ticketMessages.isInternal,
      createdAt: ticketMessages.createdAt,
      authorName: users.name,
      authorRole: users.role,
    })
    .from(ticketMessages)
    .innerJoin(users, eq(users.id, ticketMessages.authorId))
    .where(and(eq(ticketMessages.ticketId, ticketId), visibility))
    .orderBy(asc(ticketMessages.createdAt));
}

export async function listStaffMembers() {
  const db = await getDb();
  return db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.role, "staff")).orderBy(asc(users.name));
}

export type TicketMessage = Awaited<ReturnType<typeof listTicketMessages>>[number];
export type CompanyTicketRow = Awaited<ReturnType<typeof listCompanyTickets>>[number];
export type StaffTicketRow = Awaited<ReturnType<typeof listStaffTickets>>[number];
