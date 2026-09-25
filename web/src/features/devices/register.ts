import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { devices, staffDevices } from "@/db/schema";
import { hashToken, newToken } from "@/lib/auth/tokens";
import { encryptSecret } from "@/lib/desk/crypto";
import type { RegisterInput } from "./api-schemas";
import { getDeviceSummary } from "./device-auth";
import { findCompanyByCode, findCompanyCustomer } from "./people";

export type RegisterResult =
  | { status: "unknown_company" }
  | { status: "unknown_person" }
  | { status: "owned_by_other_company" }
  | { status: "team_device" }
  | { status: "ok"; companyName: string; personName: string | null; label: string | null; deviceToken: string };

/** Person and label fields to write. Missing input keeps the stored value, unless the computer moves to another company. */
function assignmentFields(input: RegisterInput, movedCompany: boolean) {
  const fields: { userId?: string | null; contactName?: string | null; label?: string | null } = {};
  if (input.personId !== undefined || input.personName !== undefined) {
    // a panel user wins over a typed name
    fields.userId = input.personId ?? null;
    fields.contactName = input.personId ? null : (input.personName ?? null);
  } else if (movedCompany) {
    fields.userId = null;
    fields.contactName = null;
  }
  if (input.label !== undefined) fields.label = input.label;
  else if (movedCompany) fields.label = null;
  return fields;
}

/**
 * Creates or updates the device by desk ID and hands out a fresh device token (only its hash is stored).
 * [signedIn]: the person proved who they are (account password or their own setup link), so the computer follows
 * them even when another company had it; a bare company code still cannot pull it away.
 */
export async function registerDevice(input: RegisterInput, signedIn = false): Promise<RegisterResult> {
  const company = await findCompanyByCode(input.customerCode);
  if (!company) return { status: "unknown_company" };
  if (input.personId && !(await findCompanyCustomer(company.id, input.personId))) return { status: "unknown_person" };

  const db = await getDb();
  const [existing] = await db
    .select({ companyId: devices.companyId, deviceTokenHash: devices.deviceTokenHash })
    .from(devices)
    .where(eq(devices.deskId, input.deskId));
  // Anyone can see a desk ID, so a computer already registered by the app cannot be pulled into another company
  // with just some company code; staff removes it from the panel first.
  if (!signedIn && existing?.deviceTokenHash && existing.companyId !== company.id) return { status: "owned_by_other_company" };
  // A GoTech computer is trusted by every locked customer; one registered to a customer as well would stay trusted.
  // Refused rather than taken off the team list, since customers see the team's IDs and could knock one off.
  const [teamDevice] = await db.select({ id: staffDevices.id }).from(staffDevices).where(eq(staffDevices.deskId, input.deskId));
  if (teamDevice) return { status: "team_device" };
  const deviceToken = newToken();
  const now = new Date();
  const fields = {
    // a computer can be re-registered under another customer
    companyId: company.id,
    hostname: input.hostname,
    platform: input.platform,
    appVersion: input.appVersion,
    unattendedPasswordEnc: typeof input.unattendedPassword === "string" ? encryptSecret(input.unattendedPassword) : null,
    deviceTokenHash: hashToken(deviceToken),
    lastRegisteredAt: now,
    ...assignmentFields(input, existing !== undefined && existing.companyId !== company.id),
  };
  const [device] = await db
    .insert(devices)
    .values({ ...fields, deskId: input.deskId, registeredAt: now })
    .onConflictDoUpdate({ target: devices.deskId, set: fields })
    .returning({ id: devices.id });

  const summary = await getDeviceSummary(device.id);
  return { status: "ok", companyName: company.name, personName: summary?.personName ?? null, label: summary?.label ?? null, deviceToken };
}
