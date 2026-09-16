import { z } from "zod";
import { CONNECT_PARAM_KINDS, type ConnectParam } from "@/features/devices/labels";
import { getDevice, logConnection } from "@/features/devices/queries";
import { getCompanyTicket } from "@/features/tickets/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { decryptSecret } from "@/lib/desk/crypto";

const HTTP_FOUND = 302;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;

const ALLOWED_FETCH_SITES = new Set(["same-origin", "none"]);
const DESK_ACTIONS = { connect: "connect", file_transfer: "file-transfer" } as const;
const isConnectParam = (value: string | null): value is ConnectParam => value !== null && Object.hasOwn(CONNECT_PARAM_KINDS, value);

/** The ticket to link the connection to: only a ticket of the device's own company, otherwise none. */
async function ticketIdFor(talep: string | null, companyId: string) {
  const number = Number(talep);
  if (!talep || !Number.isInteger(number)) return null;
  return (await getCompanyTicket(number, companyId))?.id ?? null;
}

const noStore = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
const plain = (message: string, status: number) => new Response(message, { status, headers: noStore });

/** Logs the connection and hands the staff member's browser over to the GoTech Desk app via gotechdesk:// */
export async function GET(request: Request, ctx: RouteContext<"/yonetim/cihazlar/[id]/baglan">) {
  // Only follow clicks from our own pages; blocks other sites from triggering a connection (CSRF).
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !ALLOWED_FETCH_SITES.has(fetchSite)) return plain("Geçersiz istek kaynağı.", HTTP_FORBIDDEN);

  const user = await getCurrentUser();
  if (!user) return plain("Önce giriş yapın.", HTTP_UNAUTHORIZED);
  if (user.role !== "staff") return plain("Bu işlem yalnızca GoTech ekibine açık.", HTTP_FORBIDDEN);

  const { searchParams } = new URL(request.url);
  const param = searchParams.get("tur");
  if (!isConnectParam(param)) return plain("Bağlantı türü geçersiz.", HTTP_BAD_REQUEST);

  const { id } = await ctx.params;
  const device = z.uuid().safeParse(id).success ? await getDevice(id) : null;
  if (!device) return plain("Cihaz bulunamadı.", HTTP_NOT_FOUND);

  const kind = CONNECT_PARAM_KINDS[param];
  await logConnection(device.id, user.id, kind, await ticketIdFor(searchParams.get("talep"), device.companyId));

  let target = `gotechdesk://${DESK_ACTIONS[kind]}/${device.deskId}`;
  if (device.unattendedPasswordEnc) target += `?password=${encodeURIComponent(decryptSecret(device.unattendedPasswordEnc))}`;
  // built by hand: the target is a custom scheme and must not be cached, since it can carry the password
  return new Response(null, { status: HTTP_FOUND, headers: { ...noStore, Location: target } });
}
