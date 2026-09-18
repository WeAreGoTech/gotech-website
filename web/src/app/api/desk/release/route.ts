import { deskAccountUser } from "@/features/desk-account/session";
import { deskFail, HTTP, readDeskRequest } from "@/features/devices/api-http";
import { releaseSchema } from "@/features/devices/api-schemas";
import { releaseTeamDevice } from "@/features/devices/claim";

// A team member signed in on the app and answered "this is not a GoTech computer": it leaves the team list, so the
// customer registration that follows is not refused. Staff only: customers see the team's IDs in every heartbeat, and
// letting them take one off the list would shut that computer out of every locked customer.
const RELEASES_PER_MINUTE = 10;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "release", perMinute: RELEASES_PER_MINUTE }, releaseSchema);
  if ("response" in input) return input.response;
  const user = await deskAccountUser(request);
  if (!user) return deskFail("Oturum sona erdi. Tekrar giriş yapın.", HTTP.unauthorized);
  if (user.role !== "staff") return deskFail("Bu işlem yalnızca GoTech ekibine açık.", HTTP.forbidden);

  const released = await releaseTeamDevice(input.data.deskId);
  return Response.json({ ok: true, released });
}
