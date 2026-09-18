import "server-only";
import { deskFail, DESK_ERRORS, HTTP } from "./api-http";
import { latestDeskUpdate } from "./downloads";
import type { RegisterResult } from "./register";
import { getSupportDirectory } from "./staff-devices";

// The two ways the app registers a customer's computer without a company code (signing in, a setup link) answer alike.
type Failure = Exclude<RegisterResult, { status: "ok" }>;
type Registered = Extract<RegisterResult, { status: "ok" }> & { customerCode: string };

export function registrationFailure(result: Failure): Response {
  if (result.status === "owned_by_other_company") return deskFail(DESK_ERRORS.ownedByOtherCompany, HTTP.conflict);
  if (result.status === "team_device") return deskFail(DESK_ERRORS.teamDevice, HTTP.conflict);
  return deskFail("Hesap bir firmaya bağlı değil. GoTech ile iletişime geçin.", HTTP.forbidden);
}

export async function customerRegistered({ companyName, customerCode, personName, label, deviceToken }: Registered) {
  return Response.json({
    ok: true,
    kind: "customer",
    companyName,
    customerCode,
    personName,
    label,
    deviceToken,
    support: await getSupportDirectory(),
    update: latestDeskUpdate(),
  });
}
