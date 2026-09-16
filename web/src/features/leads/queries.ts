import "server-only";
import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { leads } from "@/db/schema";

export async function listLeads() {
  const db = await getDb();
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function countNewLeads() {
  const db = await getDb();
  const [{ value }] = await db.select({ value: count() }).from(leads).where(eq(leads.status, "new"));
  return value;
}
