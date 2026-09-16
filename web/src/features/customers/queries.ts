import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, users } from "@/db/schema";

export async function listCompaniesWithCustomers() {
  const db = await getDb();
  const rows = await db
    .select({
      companyId: companies.id,
      companyName: companies.name,
      userId: users.id,
      userName: users.name,
      email: users.email,
      hasPassword: users.passwordHash,
    })
    .from(companies)
    .leftJoin(users, and(eq(users.companyId, companies.id), eq(users.role, "customer")))
    .orderBy(asc(companies.name), asc(users.name));

  const byCompany = new Map<string, { id: string; name: string; customers: { id: string; name: string; email: string; active: boolean }[] }>();
  for (const row of rows) {
    const company = byCompany.get(row.companyId) ?? { id: row.companyId, name: row.companyName, customers: [] };
    if (row.userId && row.userName && row.email) {
      company.customers.push({ id: row.userId, name: row.userName, email: row.email, active: Boolean(row.hasPassword) });
    }
    byCompany.set(row.companyId, company);
  }
  return [...byCompany.values()];
}

export async function getCompanyName(companyId: string) {
  const db = await getDb();
  const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, companyId));
  return company?.name ?? "";
}

export async function getCompany(companyId: string) {
  const db = await getDb();
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId));
  return company ?? null;
}

export async function listCompanyPeople(companyId: string) {
  const db = await getDb();
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, title: users.title, phone: users.phone, passwordHash: users.passwordHash })
    .from(users)
    .where(and(eq(users.companyId, companyId), eq(users.role, "customer")))
    .orderBy(asc(users.name));
  return rows.map(({ passwordHash, ...person }) => ({ ...person, active: Boolean(passwordHash) }));
}

export async function listStaff() {
  const db = await getDb();
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, title: users.title, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.role, "staff"))
    .orderBy(asc(users.name));
  return rows.map(({ passwordHash, ...person }) => ({ ...person, active: Boolean(passwordHash) }));
}

export type Person = Awaited<ReturnType<typeof listCompanyPeople>>[number];
export type CompanyWithCustomers = Awaited<ReturnType<typeof listCompaniesWithCustomers>>[number];
