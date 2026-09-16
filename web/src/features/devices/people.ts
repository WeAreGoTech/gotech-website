import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, users } from "@/db/schema";

/**
 * Hides the surname for the desktop app's person picker, which anyone with the company code can see:
 * "Ayşe Kaya" → "Ayşe K.", "Mehmet Ali Demir" → "Mehmet Ali D.", "Ayşe" → "Ayşe".
 */
export function maskName(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return words.join("");
  const last = words.pop() ?? "";
  return `${words.join(" ")} ${Array.from(last)[0]}.`;
}

export async function findCompanyByCode(customerCode: string) {
  const db = await getDb();
  const [company] = await db.select({ id: companies.id, name: companies.name }).from(companies).where(eq(companies.customerCode, customerCode));
  return company ?? null;
}

const customerOf = (companyId: string) => and(eq(users.companyId, companyId), eq(users.role, "customer"));

/** The company and its panel users with masked names, or null for an unknown code. */
export async function lookupCompany(customerCode: string) {
  const company = await findCompanyByCode(customerCode);
  if (!company) return null;
  const db = await getDb();
  const people = await db.select({ id: users.id, name: users.name }).from(users).where(customerOf(company.id)).orderBy(asc(users.name));
  return { companyName: company.name, people: people.map((p) => ({ id: p.id, displayName: maskName(p.name) })) };
}

/** A customer user of that company, or null. */
export async function findCompanyCustomer(companyId: string, userId: string) {
  const db = await getDb();
  const [user] = await db.select({ id: users.id, name: users.name }).from(users).where(and(eq(users.id, userId), customerOf(companyId)));
  return user ?? null;
}

/** Who opens a ticket from a computer with no linked person: the company's oldest panel user. */
export async function findOldestCustomer(companyId: string) {
  const db = await getDb();
  const [user] = await db.select({ id: users.id, name: users.name }).from(users).where(customerOf(companyId)).orderBy(asc(users.createdAt)).limit(1);
  return user ?? null;
}
