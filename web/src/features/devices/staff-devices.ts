import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { staffDevices, users } from "@/db/schema";

export type StaffDeviceRow = { id: string; deskId: string; label: string; ownerName: string };

async function queryStaffDevices(userId?: string): Promise<StaffDeviceRow[]> {
  const db = await getDb();
  return db
    .select({ id: staffDevices.id, deskId: staffDevices.deskId, label: staffDevices.label, ownerName: users.name })
    .from(staffDevices)
    .innerJoin(users, eq(users.id, staffDevices.userId))
    .where(userId ? eq(staffDevices.userId, userId) : undefined)
    .orderBy(asc(users.name), asc(staffDevices.label));
}

/** The GoTech computers one team member manages on their account page. */
export const listMyStaffDevices = (userId: string) => queryStaffDevices(userId);

/** Every GoTech computer with its owner, for the whole-team list. */
export const listStaffDevices = () => queryStaffDevices();

/** What the desktop app puts into RustDesk's ID whitelist, plus the owner to show while connected. */
export async function getSupportDirectory() {
  const rows = await queryStaffDevices();
  return { ids: rows.map((row) => row.deskId), names: Object.fromEntries(rows.map((row) => [row.deskId, row.ownerName])) };
}
