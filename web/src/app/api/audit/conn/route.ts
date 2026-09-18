import { notRegistered, readDeskRequest } from "@/features/devices/api-http";
import { connAuditSchema } from "@/features/devices/api-schemas";
import { recordConnAudit } from "@/features/devices/sessions";

// RustDesk posts its connection audit here on its own (api-server option + /api/audit/conn), with no session or
// token: the desk ID and machine UUID it sends are checked against what the computer's app reported in heartbeats.
// A connection makes three posts, and an office behind one IP can have many computers.
const AUDITS_PER_MINUTE = 300;
const HTTP_NO_CONTENT = 204;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "audit", perMinute: AUDITS_PER_MINUTE }, connAuditSchema);
  if ("response" in input) return input.response;
  if (!(await recordConnAudit(input.data))) return notRegistered();
  return new Response(null, { status: HTTP_NO_CONTENT });
}
