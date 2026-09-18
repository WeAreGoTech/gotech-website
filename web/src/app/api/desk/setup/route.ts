import { deskFail, HTTP, readDeskRequest } from "@/features/devices/api-http";
import { setupSchema } from "@/features/devices/api-schemas";
import { customerRegistered, registrationFailure } from "@/features/devices/registration-response";
import { setUpFromLink } from "@/features/devices/setup-links";

// The app at its first start, with the token of a person's setup link (from the installer's file name, or from a
// gotechdesk://kur/<token> link on a Mac): the computer is registered to that person with no password. A staff
// link only answers with the e-mail, which the app fills into its sign-in.
const SETUPS_PER_MINUTE = 10;

export async function POST(request: Request) {
  const input = await readDeskRequest(request, { bucket: "setup", perMinute: SETUPS_PER_MINUTE }, setupSchema);
  if ("response" in input) return input.response;
  const { token, ...device } = input.data;

  const result = await setUpFromLink(token, device);
  if (result.status === "invalid") {
    return deskFail("Kurulum bağlantısı geçersiz ya da süresi dolmuş. GoTech'ten yenisini isteyin.", HTTP.notFound, "invalid_link");
  }
  if (result.status === "password") return Response.json({ ok: true, kind: "password", email: result.email });
  return result.status === "ok" ? customerRegistered(result) : registrationFailure(result);
}
