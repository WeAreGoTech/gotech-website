import { notRegistered, readDeskRequest } from "@/features/devices/api-http";
import { heartbeatSchema } from "@/features/devices/api-schemas";
import { authenticateDevice, getDeviceSummary, touchDevice } from "@/features/devices/device-auth";
import { latestDeskUpdate } from "@/features/devices/downloads";
import { getSupportDirectory } from "@/features/devices/staff-devices";
import { hashToken } from "@/lib/auth/tokens";

// Sent by the GoTech Desk app while it runs; returns the registration so edits made by staff show up in the app,
// the GoTech computers it locks its ID whitelist to, and the version it should update itself to.
// Generous limit: an office behind one IP can have many computers.
const HEARTBEATS_PER_MINUTE = 120;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "heartbeat", perMinute: HEARTBEATS_PER_MINUTE }, heartbeatSchema);
  if ("response" in input) return input.response;
  const { deskId, deviceToken, hostname, appVersion, deviceUuid } = input.data;

  const device = await authenticateDevice(deskId, deviceToken);
  if (!device) return notRegistered();
  await touchDevice(device.id, { hostname, appVersion, ...(deviceUuid && { deviceUuidHash: hashToken(deviceUuid) }) });

  const [summary, support] = await Promise.all([getDeviceSummary(device.id), getSupportDirectory()]);
  if (!summary) return notRegistered();
  const { companyName, customerCode, personName, label, unattended } = summary;
  return Response.json({ ok: true, companyName, customerCode, personName, label, unattended, support, update: await latestDeskUpdate() });
}
