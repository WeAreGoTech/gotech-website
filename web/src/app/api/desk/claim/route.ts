import { deskAccountUser } from "@/features/desk-account/session";
import { deskFail, HTTP, readDeskRequest } from "@/features/devices/api-http";
import { claimSchema } from "@/features/devices/api-schemas";
import { claimCustomerDevice, claimTeamDevice } from "@/features/devices/claim";
import { latestDeskUpdate } from "@/features/devices/downloads";
import { customerRegistered, registrationFailure } from "@/features/devices/registration-response";
import { getSupportDirectory } from "@/features/devices/staff-devices";

// The app's sign-in: right after /api/login it sends the session token here and the account decides what the
// computer is. A customer's joins their company as theirs, with no company code or person picker; a team
// member's becomes one of GoTech's own. The app ends a customer's session afterwards; the device token is enough.
const CLAIMS_PER_MINUTE = 10;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "claim", perMinute: CLAIMS_PER_MINUTE }, claimSchema);
  if ("response" in input) return input.response;
  const user = await deskAccountUser(request);
  if (!user) return deskFail("Oturum sona erdi. Tekrar giriş yapın.", HTTP.unauthorized);

  if (user.role === "staff") {
    const { label, convertedFrom } = await claimTeamDevice(user, input.data);
    return Response.json({ ok: true, kind: "team", ownerName: user.name, label, convertedFrom, support: await getSupportDirectory(), update: await latestDeskUpdate() });
  }

  const result = await claimCustomerDevice(user, input.data);
  return result.status === "ok" ? customerRegistered(result) : registrationFailure(result);
}
