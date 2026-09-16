import { deskFail, DESK_ERRORS, HTTP, readDeskRequest } from "@/features/devices/api-http";
import { registerSchema } from "@/features/devices/api-schemas";
import { registerDevice } from "@/features/devices/register";

// Called by the GoTech Desk desktop app when the customer enters the company code and picks a person; no session.
const REGISTRATIONS_PER_MINUTE = 10;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "register", perMinute: REGISTRATIONS_PER_MINUTE }, registerSchema);
  if ("response" in input) return input.response;

  const result = await registerDevice(input.data);
  if (result.status === "unknown_company") return deskFail(DESK_ERRORS.unknownCompany, HTTP.notFound);
  if (result.status === "unknown_person") return deskFail("Seçilen kişi bu firmada bulunamadı.", HTTP.badRequest);
  const { companyName, personName, label, deviceToken } = result;
  return Response.json({ ok: true, companyName, personName, label, deviceToken });
}
