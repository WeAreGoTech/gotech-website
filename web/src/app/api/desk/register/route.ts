import { registerDevice, registerSchema } from "@/features/devices/register";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

// Called by the GoTech Desk desktop app when the customer enters their customer number; no session.
const REGISTRATIONS_PER_WINDOW = 10;
const REGISTRATION_WINDOW_MS = 60_000;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_TOO_MANY = 429;

const fail = (error: string, status: number) => Response.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  if (isRateLimited(`desk-register:${await clientIp()}`, REGISTRATIONS_PER_WINDOW, REGISTRATION_WINDOW_MS)) {
    return fail("Çok fazla deneme. Lütfen biraz sonra tekrar deneyin.", HTTP_TOO_MANY);
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return fail("Geçersiz istek.", HTTP_BAD_REQUEST);

  const companyName = await registerDevice(parsed.data);
  if (companyName === null) return fail("Müşteri numarası bulunamadı.", HTTP_NOT_FOUND);
  return Response.json({ ok: true, companyName });
}
