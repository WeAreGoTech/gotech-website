import { notRegistered, readDeskRequest } from "@/features/devices/api-http";
import { sessionsSchema } from "@/features/devices/api-schemas";
import { authenticateDevice } from "@/features/devices/device-auth";
import { sessionPeerName } from "@/features/devices/labels";
import { APP_SESSIONS, listDeviceSessions } from "@/features/devices/sessions";

// The connection history the GoTech Desk app shows on its home screen.
const REQUESTS_PER_MINUTE = 30;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "sessions", perMinute: REQUESTS_PER_MINUTE }, sessionsSchema);
  if ("response" in input) return input.response;

  const device = await authenticateDevice(input.data.deskId, input.data.deviceToken);
  if (!device) return notRegistered();

  const rows = await listDeviceSessions(device.id, APP_SESSIONS);
  const sessions = rows.map((s) => ({
    name: sessionPeerName(s),
    connType: s.connType,
    startedAt: s.startedAt?.toISOString() ?? null,
    endedAt: s.endedAt?.toISOString() ?? null,
  }));
  return Response.json({ ok: true, sessions });
}
