import { readDeskRequest } from "@/features/devices/api-http";
import { teamSchema } from "@/features/devices/api-schemas";
import { latestDeskUpdate } from "@/features/devices/downloads";
import { findStaffDevice, getSupportDirectory } from "@/features/devices/staff-devices";

// Asked by the app on a computer with no customer registration: is this one of GoTech's own machines?
// A team member's computer has no device token to authenticate with — it is known by the desk ID a
// staff member added on their account page, so the answer only says whether that ID is on the list.
const CHECKS_PER_MINUTE = 60;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "team", perMinute: CHECKS_PER_MINUTE }, teamSchema);
  if ("response" in input) return input.response;

  const device = await findStaffDevice(input.data.deskId);
  if (!device) return Response.json({ ok: false });

  const support = await getSupportDirectory();
  return Response.json({ ok: true, ownerName: device.ownerName, label: device.label, support, update: latestDeskUpdate() });
}
