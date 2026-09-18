import "server-only";
import { timingSafeEqual } from "node:crypto";
import { and, desc, eq, isNotNull, isNull, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { deskSessions, devices, staffDevices, users } from "@/db/schema";
import { hashToken } from "@/lib/auth/tokens";
import type { ConnAuditInput } from "./api-schemas";

const DEVICE_SESSIONS = 50;
const COMPANY_SESSIONS = 30;
export const APP_SESSIONS = 20;

/** The customer computer with that desk ID, if the machine UUID matches the one its app sends with heartbeats. */
async function deviceByUuid(deskId: string, uuid: string) {
  const db = await getDb();
  const [device] = await db.select({ id: devices.id, uuidHash: devices.deviceUuidHash }).from(devices).where(eq(devices.deskId, deskId));
  if (!device?.uuidHash) return null;
  const expected = Buffer.from(device.uuidHash);
  const given = Buffer.from(hashToken(uuid));
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return device.id;
}

/** The newest session of that connection number that matches `where`. */
async function openSession(deviceId: string, connId: number, where: SQL | undefined) {
  const db = await getDb();
  const [row] = await db
    .select({ id: deskSessions.id })
    .from(deskSessions)
    .where(and(eq(deskSessions.deviceId, deviceId), eq(deskSessions.connId, connId), where))
    .orderBy(desc(deskSessions.startedAt))
    .limit(1);
  return row?.id ?? null;
}

async function staffUserOf(deskId: string) {
  const db = await getDb();
  const [row] = await db.select({ userId: staffDevices.userId }).from(staffDevices).where(eq(staffDevices.deskId, deskId));
  return row?.userId ?? null;
}

/** Records one audit post; false when the computer is not a customer computer we can verify. */
export async function recordConnAudit(input: ConnAuditInput) {
  const deviceId = await deviceByUuid(input.id, input.uuid);
  if (!deviceId) return false;
  const db = await getDb();
  const connId = input.conn_id;

  if (input.action === "new") {
    await db.insert(deskSessions).values({ deviceId, connId, nonce: input.nonce, ip: input.ip ?? null }).onConflictDoNothing();
    return true;
  }
  if (input.peer) {
    const [peerDeskId = "", peerName = ""] = input.peer;
    const fields = {
      peerDeskId,
      peerName,
      connType: input.type ?? null,
      staffUserId: await staffUserOf(peerDeskId),
      authorizedAt: new Date(),
    };
    const id = await openSession(deviceId, connId, and(isNull(deskSessions.authorizedAt), isNull(deskSessions.endedAt)));
    if (id) await db.update(deskSessions).set(fields).where(eq(deskSessions.id, id));
    // the "new" record was lost: the session still counts from here
    else await db.insert(deskSessions).values({ deviceId, connId, nonce: input.nonce, ...fields }).onConflictDoNothing();
    return true;
  }
  if (input.action === "close") {
    const id = await openSession(deviceId, connId, isNull(deskSessions.endedAt));
    if (id) await db.update(deskSessions).set({ endedAt: new Date() }).where(eq(deskSessions.id, id));
  }
  return true;
}

async function querySessions(where: SQL, limit: number) {
  const db = await getDb();
  return db
    .select({
      id: deskSessions.id,
      deviceId: deskSessions.deviceId,
      hostname: devices.hostname,
      label: devices.label,
      staffName: users.name,
      peerName: deskSessions.peerName,
      peerDeskId: deskSessions.peerDeskId,
      connType: deskSessions.connType,
      startedAt: deskSessions.authorizedAt,
      endedAt: deskSessions.endedAt,
    })
    .from(deskSessions)
    .innerJoin(devices, eq(devices.id, deskSessions.deviceId))
    .leftJoin(users, eq(users.id, deskSessions.staffUserId))
    // only sessions someone was let into; refused and abandoned attempts stay out of the history
    .where(and(where, isNotNull(deskSessions.authorizedAt)))
    .orderBy(desc(deskSessions.authorizedAt))
    .limit(limit);
}

export const listDeviceSessions = (deviceId: string, limit = DEVICE_SESSIONS) => querySessions(eq(deskSessions.deviceId, deviceId), limit);

export const listCompanySessions = (companyId: string) => querySessions(eq(devices.companyId, companyId), COMPANY_SESSIONS);

export type SessionRow = Awaited<ReturnType<typeof listDeviceSessions>>[number];
