// Used by server actions and the development seed (which CLI scripts load), so no "server-only" import.
import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Database } from "@/db";
import { companies } from "@/db/schema";

const CODE_MIN = 100_000;
const CODE_MAX_EXCLUSIVE = 1_000_000;
const MAX_ATTEMPTS = 20;

export const CUSTOMER_CODE_PATTERN = /^\d{6}$/;

/** A random 6-digit customer number that no company uses yet. */
export async function newCustomerCode(db: Pick<Database, "select">): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = String(randomInt(CODE_MIN, CODE_MAX_EXCLUSIVE));
    const [taken] = await db.select({ id: companies.id }).from(companies).where(eq(companies.customerCode, code));
    if (!taken) return code;
  }
  throw new Error("Could not find a free customer code.");
}
