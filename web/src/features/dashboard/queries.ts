import "server-only";
import { and, avg, count, desc, eq, isNotNull, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, documents, projectMilestones, projects, ticketMessages, tickets, users } from "@/db/schema";
import { listInvoices } from "@/features/invoices/queries";
import { listProjects, listUpcomingMilestones } from "@/features/projects/queries";
import { countNewLeads } from "@/features/leads/queries";
import { dayKey } from "@/lib/dates";

const FEED_SIZE = 6;
const UPCOMING_DAYS = 14;

export type ActivityItem = { id: string; kind: "message" | "document" | "milestone" | "invoice"; title: string; detail: string; at: Date; href: string };

export async function customerOverview(companyId: string) {
  const db = await getDb();
  const [openTickets, projectList, invoiceList, recentMessages, recentDocuments, recentMilestones] = await Promise.all([
    db.select({ value: count() }).from(tickets).where(and(eq(tickets.companyId, companyId), ne(tickets.status, "closed"))),
    listProjects(companyId),
    listInvoices(companyId),
    db
      .select({ id: ticketMessages.id, at: ticketMessages.createdAt, author: users.name, subject: tickets.subject, number: tickets.number })
      .from(ticketMessages)
      .innerJoin(tickets, eq(tickets.id, ticketMessages.ticketId))
      .innerJoin(users, eq(users.id, ticketMessages.authorId))
      .where(and(eq(tickets.companyId, companyId), eq(users.role, "staff"), eq(ticketMessages.isInternal, false)))
      .orderBy(desc(ticketMessages.createdAt))
      .limit(FEED_SIZE),
    db.select().from(documents).where(eq(documents.companyId, companyId)).orderBy(desc(documents.createdAt)).limit(FEED_SIZE),
    db
      .select({ id: projectMilestones.id, title: projectMilestones.title, at: projectMilestones.completedAt, projectId: projects.id, projectName: projects.name })
      .from(projectMilestones)
      .innerJoin(projects, eq(projects.id, projectMilestones.projectId))
      .where(and(eq(projects.companyId, companyId), isNotNull(projectMilestones.completedAt)))
      .orderBy(desc(projectMilestones.completedAt))
      .limit(FEED_SIZE),
  ]);

  const unpaid = invoiceList.filter((i) => i.state === "pending" || i.state === "overdue");
  const nextInvoice = [...unpaid].sort((a, b) => a.dueOn.getTime() - b.dueOn.getTime())[0] ?? null;

  const feed: ActivityItem[] = [
    ...recentMessages.map((m) => ({ id: m.id, kind: "message" as const, title: `${m.author} yanıt yazdı`, detail: m.subject, at: m.at, href: `/panel/talep/${m.number}` })),
    ...recentDocuments.map((d) => ({ id: d.id, kind: "document" as const, title: "Yeni doküman eklendi", detail: d.title, at: d.createdAt, href: "/panel/dokumanlar" })),
    ...recentMilestones.map((m) => ({ id: m.id, kind: "milestone" as const, title: `${m.title} tamamlandı`, detail: m.projectName, at: m.at!, href: `/panel/projeler/${m.projectId}` })),
    ...invoiceList.slice(0, FEED_SIZE).map((i) => ({ id: i.id, kind: "invoice" as const, title: "Fatura kesildi", detail: i.number, at: new Date(`${dayKey(i.issuedOn)}T09:00:00+03:00`), href: `/panel/faturalar/${i.number}` })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, FEED_SIZE);

  return {
    openTickets: openTickets[0].value,
    activeProjects: projectList.filter((p) => p.stage !== "live"),
    liveProjects: projectList.filter((p) => p.stage === "live").length,
    unpaidTotal: unpaid.reduce((sum, i) => sum + i.total, 0),
    unpaidCount: unpaid.length,
    overdueCount: unpaid.filter((i) => i.state === "overdue").length,
    nextInvoice,
    feed,
  };
}

export async function staffOverview(staffId: string) {
  const db = await getDb();
  const [statusCounts, urgentOpen, mine, rating, newLeads, invoiceList, upcoming, customerCount] = await Promise.all([
    db.select({ status: tickets.status, value: count() }).from(tickets).groupBy(tickets.status),
    db.select({ value: count() }).from(tickets).where(and(eq(tickets.priority, "urgent"), ne(tickets.status, "closed"))),
    db
      .select({ id: tickets.id, number: tickets.number, subject: tickets.subject, status: tickets.status, priority: tickets.priority, category: tickets.category, updatedAt: tickets.updatedAt, companyName: companies.name })
      .from(tickets)
      .innerJoin(companies, eq(companies.id, tickets.companyId))
      .where(and(eq(tickets.assigneeId, staffId), ne(tickets.status, "closed")))
      .orderBy(desc(tickets.updatedAt)),
    db.select({ value: avg(tickets.rating), rated: count(tickets.rating) }).from(tickets).where(isNotNull(tickets.rating)),
    countNewLeads(),
    listInvoices(),
    listUpcomingMilestones(UPCOMING_DAYS),
    db.select({ value: count() }).from(companies),
  ]);

  const byStatus = Object.fromEntries(statusCounts.map((s) => [s.status, s.value]));
  const thisMonth = dayKey(new Date()).slice(0, 7);
  return {
    open: byStatus.open ?? 0,
    active: (byStatus.open ?? 0) + (byStatus.in_progress ?? 0) + (byStatus.waiting_customer ?? 0),
    urgentOpen: urgentOpen[0].value,
    mine,
    rating: rating[0].value ? Number(rating[0].value) : null,
    ratedCount: rating[0].rated,
    newLeads,
    collectedThisMonth: invoiceList.filter((i) => i.paidAt && dayKey(i.paidAt).startsWith(thisMonth)).reduce((sum, i) => sum + i.total, 0),
    overdue: invoiceList.filter((i) => i.state === "overdue"),
    upcoming,
    customerCount: customerCount[0].value,
  };
}
