import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, deviceConnections, devices, users, type DeviceConnectionKind } from "@/db/schema";
import { getOnlineStates } from "@/lib/desk/online";

const RECENT_CONNECTIONS = 30;

/** Devices with their online state (null = unknown); pass companyId to limit to one customer. */
export async function listDevices(companyId?: string) {
  const db = await getDb();
  const rows = await db
    .select({ device: devices, companyName: companies.name })
    .from(devices)
    .innerJoin(companies, eq(companies.id, devices.companyId))
    .where(companyId ? eq(devices.companyId, companyId) : undefined)
    .orderBy(asc(companies.name), asc(devices.hostname));
  const states = await getOnlineStates(rows.map((r) => r.device.deskId));

  // the encrypted password never leaves the server; pages only need to know whether one is stored
  return {
    statusKnown: states !== null,
    devices: rows.map(({ device: { unattendedPasswordEnc, ...device }, companyName }) => ({
      ...device,
      companyName,
      unattended: unattendedPasswordEnc !== null,
      online: states ? (states.get(device.deskId) ?? false) : null,
    })),
  };
}

export async function getDevice(id: string) {
  const db = await getDb();
  const [device] = await db.select().from(devices).where(eq(devices.id, id));
  return device ?? null;
}

export async function listRecentConnections() {
  const db = await getDb();
  return db
    .select({
      id: deviceConnections.id,
      kind: deviceConnections.kind,
      createdAt: deviceConnections.createdAt,
      userName: users.name,
      hostname: devices.hostname,
      deskId: devices.deskId,
      companyId: companies.id,
      companyName: companies.name,
    })
    .from(deviceConnections)
    .innerJoin(devices, eq(devices.id, deviceConnections.deviceId))
    .innerJoin(companies, eq(companies.id, devices.companyId))
    .innerJoin(users, eq(users.id, deviceConnections.userId))
    .orderBy(desc(deviceConnections.createdAt))
    .limit(RECENT_CONNECTIONS);
}

export async function logConnection(deviceId: string, userId: string, kind: DeviceConnectionKind) {
  const db = await getDb();
  await db.insert(deviceConnections).values({ deviceId, userId, kind });
}

export type DeviceRow = Awaited<ReturnType<typeof listDevices>>["devices"][number];
export type ConnectionRow = Awaited<ReturnType<typeof listRecentConnections>>[number];
