import "server-only";
import { timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, devices, users } from "@/db/schema";
import { hashToken } from "@/lib/auth/tokens";

/** The device with that desk ID, if the token matches the one handed out at its last registration. */
export async function authenticateDevice(deskId: string, deviceToken: string) {
  const db = await getDb();
  const [device] = await db.select().from(devices).where(eq(devices.deskId, deskId));
  if (!device?.deviceTokenHash) return null;
  const expected = Buffer.from(device.deviceTokenHash);
  const given = Buffer.from(hashToken(deviceToken));
  // both are hex SHA-256 digests, so the lengths only differ for corrupted rows
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return device;
}

export type AuthenticatedDevice = NonNullable<Awaited<ReturnType<typeof authenticateDevice>>>;

/** What the desktop app shows about its registration. */
export async function getDeviceSummary(deviceId: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      hostname: devices.hostname,
      deskId: devices.deskId,
      label: devices.label,
      contactName: devices.contactName,
      userName: users.name,
      unattendedPasswordEnc: devices.unattendedPasswordEnc,
      companyName: companies.name,
      customerCode: companies.customerCode,
    })
    .from(devices)
    .innerJoin(companies, eq(companies.id, devices.companyId))
    .leftJoin(users, eq(users.id, devices.userId))
    .where(eq(devices.id, deviceId));
  if (!row) return null;
  const { unattendedPasswordEnc, userName, contactName, ...rest } = row;
  return { ...rest, personName: userName ?? contactName, unattended: unattendedPasswordEnc !== null };
}

export async function touchDevice(deviceId: string, fields: { hostname: string; appVersion: string }) {
  const db = await getDb();
  await db.update(devices).set({ ...fields, lastRegisteredAt: new Date() }).where(eq(devices.id, deviceId));
}
