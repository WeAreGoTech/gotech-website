import "server-only";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { companies, devices, staffDevices } from "@/db/schema";
import type { DeskAccountUser } from "@/features/desk-account/session";
import type { ClaimInput } from "./api-schemas";
import { LABEL_MAX } from "./labels";
import { registerDevice, type RegisterResult } from "./register";

type RegisterOk = Extract<RegisterResult, { status: "ok" }>;
export type CustomerClaimResult = Exclude<RegisterResult, RegisterOk> | (RegisterOk & { customerCode: string });
export type TeamClaimResult = { status: "customer_device"; companyName: string } | { status: "ok"; label: string };

/** A customer signed in on this computer: it joins their company as their own, as if they had typed the company code and picked themselves. */
export async function claimCustomerDevice(user: DeskAccountUser, input: ClaimInput): Promise<CustomerClaimResult> {
  if (!user.companyId) return { status: "unknown_company" };
  const db = await getDb();
  const [company] = await db.select({ customerCode: companies.customerCode }).from(companies).where(eq(companies.id, user.companyId));
  if (!company) return { status: "unknown_company" };
  const result = await registerDevice({ ...input, customerCode: company.customerCode, personId: user.id });
  return result.status === "ok" ? { ...result, customerCode: company.customerCode } : result;
}

/** A team member signed in and said this computer is theirs: it joins the list every locked customer computer accepts. */
export async function claimTeamDevice(user: DeskAccountUser, input: ClaimInput): Promise<TeamClaimResult> {
  const db = await getDb();
  // A technician signing in on a customer's computer must not make it trusted by every other customer.
  const [customerDevice] = await db
    .select({ companyName: companies.name })
    .from(devices)
    .innerJoin(companies, eq(companies.id, devices.companyId))
    .where(eq(devices.deskId, input.deskId));
  if (customerDevice) return { status: "customer_device", companyName: customerDevice.companyName };

  // the computer goes to whoever signed in on it last; a label someone already gave it stays
  const [row] = await db
    .insert(staffDevices)
    .values({ userId: user.id, deskId: input.deskId, label: input.hostname.slice(0, LABEL_MAX) })
    .onConflictDoUpdate({ target: staffDevices.deskId, set: { userId: user.id } })
    .returning({ label: staffDevices.label });
  revalidatePath("/yonetim/hesap");
  revalidatePath("/yonetim/ekip");
  revalidatePath("/yonetim/cihazlar");
  return { status: "ok", label: row.label };
}
