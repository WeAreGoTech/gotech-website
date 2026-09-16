import { deskFail, DESK_ERRORS, HTTP, readDeskRequest } from "@/features/devices/api-http";
import { lookupSchema } from "@/features/devices/api-schemas";
import { lookupCompany } from "@/features/devices/people";

// Called by the GoTech Desk app when the customer types the company code; lists people to pick from. No session.
// Tighter limit than the other desk routes because the answer contains (masked) names.
const LOOKUPS_PER_MINUTE = 10;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "lookup", perMinute: LOOKUPS_PER_MINUTE }, lookupSchema);
  if ("response" in input) return input.response;

  const result = await lookupCompany(input.data.customerCode);
  if (!result) return deskFail(DESK_ERRORS.unknownCompany, HTTP.notFound);
  return Response.json({ ok: true, ...result });
}
