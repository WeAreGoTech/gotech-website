import "server-only";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { companies, devices, staffDevices } from "@/db/schema";
import type { DeskAccountUser } from "@/features/desk-account/session";
import type { ClaimInput } from "./api-schemas";
import { deviceHref, LABEL_MAX } from "./labels";
import { registerDevice, type RegisterResult } from "./register";

type RegisterOk = Extract<RegisterResult, { status: "ok" }>;
export type CustomerClaimResult = Exclude<RegisterResult, RegisterOk> | (RegisterOk & { customerCode: string });
export type TeamClaimResult = { label: string; convertedFrom: string | null };

function revalidateTeam() {
  revalidatePath("/yonetim/hesap");
  revalidatePath("/yonetim/ekip");
  revalidatePath("/yonetim/cihazlar");
}

/** A customer signed in on this computer: it joins their company as their own, as if they had typed the company code and picked themselves. */
export async function claimCustomerDevice(user: DeskAccountUser, input: ClaimInput): Promise<CustomerClaimResult> {
  if (!user.companyId) return { status: "unknown_company" };
  const db = await getDb();
  const [company] = await db.select({ customerCode: companies.customerCode }).from(companies).where(eq(companies.id, user.companyId));
  if (!company) return { status: "unknown_company" };
  const result = await registerDevice({ ...input, customerCode: company.customerCode, personId: user.id });
  return result.status === "ok" ? { ...result, customerCode: company.customerCode } : result;
}

/**
 * A team member signed in and answered that this computer is GoTech's: it joins the list every locked customer computer
 * accepts. That answer is the confirmation, so a customer registration the computer had is dropped, as "Kaldır" on the
 * devices page would do; only staff get here, the same people who can remove devices anyway.
 */
export async function claimTeamDevice(user: DeskAccountUser, input: ClaimInput): Promise<TeamClaimResult> {
  const db = await getDb();
  const { customerDevice, label } = await db.transaction(async (tx) => {
    const [found] = await tx
      .select({ id: devices.id, companyId: devices.companyId, companyName: companies.name })
      .from(devices)
      .innerJoin(companies, eq(companies.id, devices.companyId))
      .where(eq(devices.deskId, input.deskId));
    if (found) await tx.delete(devices).where(eq(devices.id, found.id));
    // the computer goes to whoever signed in on it last; a label someone already gave it stays
    const [row] = await tx
      .insert(staffDevices)
      .values({ userId: user.id, deskId: input.deskId, label: input.hostname.slice(0, LABEL_MAX) })
      .onConflictDoUpdate({ target: staffDevices.deskId, set: { userId: user.id } })
      .returning({ label: staffDevices.label });
    return { customerDevice: found, label: row.label };
  });
  revalidateTeam();
  if (customerDevice) {
    revalidatePath(deviceHref(customerDevice.id));
    revalidatePath(`/yonetim/musteriler/${customerDevice.companyId}`);
    revalidatePath("/panel/uzak-destek");
    revalidatePath("/panel/ekip");
  }
  return { label, convertedFrom: customerDevice?.companyName ?? null };
}

/** A team member answered that this computer is not GoTech's: it leaves the team list, so a customer registration can follow. */
export async function releaseTeamDevice(deskId: string) {
  const db = await getDb();
  const removed = await db.delete(staffDevices).where(eq(staffDevices.deskId, deskId)).returning({ id: staffDevices.id });
  if (removed.length > 0) revalidateTeam();
  return removed.length > 0;
}
