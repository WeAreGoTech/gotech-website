import "server-only";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { companies, devices } from "@/db/schema";
import { CUSTOMER_CODE_PATTERN } from "@/features/customers/customer-code";
import { encryptSecret } from "@/lib/desk/crypto";

export const registerSchema = z.object({
  customerCode: z.string().regex(CUSTOMER_CODE_PATTERN),
  deskId: z.string().regex(/^\d{6,12}$/),
  hostname: z.string().trim().min(1).max(100),
  platform: z.string().trim().min(1).max(20),
  appVersion: z.string().trim().min(1).max(30),
  // null or missing means the customer turned unattended access off
  unattendedPassword: z.string().min(8).max(128).nullish(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/** Creates or updates the device by desk ID. Returns the company name, or null for an unknown customer code. */
export async function registerDevice(input: RegisterInput): Promise<string | null> {
  const db = await getDb();
  const [company] = await db.select({ id: companies.id, name: companies.name }).from(companies).where(eq(companies.customerCode, input.customerCode));
  if (!company) return null;

  const now = new Date();
  const fields = {
    // a computer can be re-registered under another customer
    companyId: company.id,
    hostname: input.hostname,
    platform: input.platform,
    appVersion: input.appVersion,
    unattendedPasswordEnc: typeof input.unattendedPassword === "string" ? encryptSecret(input.unattendedPassword) : null,
    lastRegisteredAt: now,
  };
  await db
    .insert(devices)
    .values({ ...fields, deskId: input.deskId, registeredAt: now })
    .onConflictDoUpdate({ target: devices.deskId, set: fields });
  return company.name;
}
