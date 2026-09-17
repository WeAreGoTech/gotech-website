import "server-only";
import { and, asc, count, desc, eq, isNotNull, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { companies, deviceConnections, devices, tickets, users, type DeviceConnectionKind } from "@/db/schema";
import { getOnlineStates } from "@/lib/desk/online";

const RECENT_CONNECTIONS = 30;
const DEVICE_CONNECTIONS = 50;

// everything but the device token hash, which never leaves the server
const deviceColumns = {
  id: devices.id,
  companyId: devices.companyId,
  userId: devices.userId,
  contactName: devices.contactName,
  label: devices.label,
  deskId: devices.deskId,
  hostname: devices.hostname,
  platform: devices.platform,
  appVersion: devices.appVersion,
  unattendedPasswordEnc: devices.unattendedPasswordEnc,
  registeredAt: devices.registeredAt,
  lastRegisteredAt: devices.lastRegisteredAt,
};

async function queryDevices(where: SQL | undefined) {
  const db = await getDb();
  const rows = await db
    .select({ device: deviceColumns, companyName: companies.name, userName: users.name, userRemovedAt: users.removedAt })
    .from(devices)
    .innerJoin(companies, eq(companies.id, devices.companyId))
    .leftJoin(users, eq(users.id, devices.userId))
    .where(where)
    .orderBy(asc(companies.name), asc(devices.hostname));
  const states = await getOnlineStates(rows.map((r) => r.device.deskId));

  // the encrypted password never leaves the server either; pages only need to know whether one is stored
  return {
    statusKnown: states !== null,
    devices: rows.map(({ device: { unattendedPasswordEnc, ...device }, companyName, userName, userRemovedAt }) => ({
      ...device,
      companyName,
      // a linked panel user, else the name typed in the app; personIsUser tells the two apart
      personName: userName ?? device.contactName,
      personIsUser: userName !== null,
      // the computer stays registered when its person leaves the company; staff sees who it was
      personRemoved: userName !== null && userRemovedAt !== null,
      unattended: unattendedPasswordEnc !== null,
      online: states ? (states.get(device.deskId) ?? false) : null,
    })),
  };
}

/** Devices with their online state (null = unknown); pass companyId to limit to one customer. */
export const listDevices = (companyId?: string) => queryDevices(companyId ? eq(devices.companyId, companyId) : undefined);

/** One device for its detail page, with the same fields as the list. */
export async function getDeviceView(id: string) {
  const { statusKnown, devices: [device] } = await queryDevices(eq(devices.id, id));
  return device ? { device, statusKnown } : null;
}

export async function getDevice(id: string) {
  const db = await getDb();
  const [device] = await db.select().from(devices).where(eq(devices.id, id));
  return device ?? null;
}

/** Label or hostname of a company's device, for the customer's ticket page. */
export async function getCompanyDeviceName(id: string, companyId: string) {
  const db = await getDb();
  const [device] = await db
    .select({ label: devices.label, hostname: devices.hostname })
    .from(devices)
    .where(and(eq(devices.id, id), eq(devices.companyId, companyId)));
  return device ? (device.label ?? device.hostname) : null;
}

/** Number of devices linked to each person of a company, by user ID. */
export async function countDevicesByUser(companyId: string): Promise<Record<string, number>> {
  const db = await getDb();
  const rows = await db
    .select({ userId: devices.userId, value: count() })
    .from(devices)
    .where(and(eq(devices.companyId, companyId), isNotNull(devices.userId)))
    .groupBy(devices.userId);
  return Object.fromEntries(rows.flatMap((r) => (r.userId ? [[r.userId, r.value]] : [])));
}

async function queryConnections(where: SQL | undefined, limit: number) {
  const db = await getDb();
  return db
    .select({
      id: deviceConnections.id,
      kind: deviceConnections.kind,
      createdAt: deviceConnections.createdAt,
      userName: users.name,
      deviceId: devices.id,
      hostname: devices.hostname,
      label: devices.label,
      deskId: devices.deskId,
      companyId: companies.id,
      companyName: companies.name,
      ticketNumber: tickets.number,
    })
    .from(deviceConnections)
    .innerJoin(devices, eq(devices.id, deviceConnections.deviceId))
    .innerJoin(companies, eq(companies.id, devices.companyId))
    .innerJoin(users, eq(users.id, deviceConnections.userId))
    .leftJoin(tickets, eq(tickets.id, deviceConnections.ticketId))
    .where(where)
    .orderBy(desc(deviceConnections.createdAt))
    .limit(limit);
}

export const listRecentConnections = () => queryConnections(undefined, RECENT_CONNECTIONS);

export const listDeviceConnections = (deviceId: string) => queryConnections(eq(deviceConnections.deviceId, deviceId), DEVICE_CONNECTIONS);

export async function logConnection(deviceId: string, userId: string, kind: DeviceConnectionKind, ticketId: string | null) {
  const db = await getDb();
  await db.insert(deviceConnections).values({ deviceId, userId, kind, ticketId });
}

export type DeviceRow = Awaited<ReturnType<typeof listDevices>>["devices"][number];
export type ConnectionRow = Awaited<ReturnType<typeof listRecentConnections>>[number];
