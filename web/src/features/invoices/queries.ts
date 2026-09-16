import "server-only";
import { and, asc, desc, eq, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, invoiceLines, invoices, projects } from "@/db/schema";
import { invoiceState, withVat } from "./calc";

const subtotal = sql<number>`coalesce(sum(${invoiceLines.quantity} * ${invoiceLines.unitPrice}), 0)`.mapWith(Number);

/** Invoices with totals and derived state (overdue); pass companyId to limit to one customer. */
export async function listInvoices(companyId?: string) {
  const db = await getDb();
  const rows = await db
    .select({ invoice: invoices, companyName: companies.name, projectName: projects.name, subtotal })
    .from(invoices)
    .innerJoin(companies, eq(companies.id, invoices.companyId))
    .leftJoin(projects, eq(projects.id, invoices.projectId))
    .leftJoin(invoiceLines, eq(invoiceLines.invoiceId, invoices.id))
    .where(companyId ? eq(invoices.companyId, companyId) : undefined)
    .groupBy(invoices.id, companies.name, projects.name)
    .orderBy(desc(invoices.issuedOn), desc(invoices.number));

  return rows.map((r) => ({
    ...r.invoice,
    companyName: r.companyName,
    projectName: r.projectName,
    state: invoiceState(r.invoice.status, r.invoice.dueOn),
    ...withVat(r.subtotal),
  }));
}

export async function getInvoice(number: string, companyId?: string) {
  const db = await getDb();
  const scope: SQL[] = [eq(invoices.number, number)];
  if (companyId) scope.push(eq(invoices.companyId, companyId));
  const [row] = await db
    .select({ invoice: invoices, companyName: companies.name, projectName: projects.name })
    .from(invoices)
    .innerJoin(companies, eq(companies.id, invoices.companyId))
    .leftJoin(projects, eq(projects.id, invoices.projectId))
    .where(and(...scope));
  if (!row) return null;

  const lines = await db.select().from(invoiceLines).where(eq(invoiceLines.invoiceId, row.invoice.id)).orderBy(asc(invoiceLines.position));
  const lineSum = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  return {
    ...row.invoice,
    companyName: row.companyName,
    projectName: row.projectName,
    lines,
    state: invoiceState(row.invoice.status, row.invoice.dueOn),
    ...withVat(lineSum),
  };
}

export type InvoiceSummary = Awaited<ReturnType<typeof listInvoices>>[number];
export type InvoiceDetail = NonNullable<Awaited<ReturnType<typeof getInvoice>>>;
