import { deskFail, HTTP, notRegistered, readDeskRequest } from "@/features/devices/api-http";
import { supportRequestSchema } from "@/features/devices/api-schemas";
import { authenticateDevice } from "@/features/devices/device-auth";
import { createSupportRequest } from "@/features/devices/support";

// "Destek iste" in the GoTech Desk app: opens a ticket linked to the computer.
const REQUESTS_PER_MINUTE = 5;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "support", perMinute: REQUESTS_PER_MINUTE }, supportRequestSchema);
  if ("response" in input) return input.response;

  const device = await authenticateDevice(input.data.deskId, input.data.deviceToken);
  if (!device) return notRegistered();

  const result = await createSupportRequest(device, input.data.message);
  if (result.status === "no_customer_user") return deskFail("Bu firmada panel kullanıcısı yok. Lütfen GoTech'i arayın.", HTTP.conflict);
  return Response.json({ ok: true, ticketNumber: result.ticketNumber });
}
