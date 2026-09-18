import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { staffDevices, users } from "@/db/schema";

export type StaffDeviceRow = { id: string; deskId: string; label: string; ownerName: string };

// A team member who left takes their computers with them: out of every customer's whitelist and the team lists.
const ownerActive = isNull(users.removedAt);

async function queryStaffDevices(userId?: string): Promise<StaffDeviceRow[]> {
  const db = await getDb();
  return db
    .select({ id: staffDevices.id, deskId: staffDevices.deskId, label: staffDevices.label, ownerName: users.name })
    .from(staffDevices)
    .innerJoin(users, eq(users.id, staffDevices.userId))
    .where(and(ownerActive, userId ? eq(staffDevices.userId, userId) : undefined))
    .orderBy(asc(users.name), asc(staffDevices.label));
}

/** The GoTech computers one team member manages on their account page. */
export const listMyStaffDevices = (userId: string) => queryStaffDevices(userId);

/** Every GoTech computer with its owner, for the whole-team list. */
export const listStaffDevices = () => queryStaffDevices();

/** Tells the app whether the computer it runs on is one of GoTech's own, so it skips the customer registration. */
export async function findStaffDevice(deskId: string): Promise<StaffDeviceRow | null> {
  const db = await getDb();
  const [row] = await db
    .select({ id: staffDevices.id, deskId: staffDevices.deskId, label: staffDevices.label, ownerName: users.name })
    .from(staffDevices)
    .innerJoin(users, eq(users.id, staffDevices.userId))
    .where(and(ownerActive, eq(staffDevices.deskId, deskId)))
    .limit(1);
  return row ?? null;
}

/** What the desktop app puts into RustDesk's ID whitelist, plus the owner to show while connected. */
export async function getSupportDirectory() {
  const rows = await queryStaffDevices();
  return { ids: rows.map((row) => row.deskId), names: Object.fromEntries(rows.map((row) => [row.deskId, row.ownerName])) };
}
