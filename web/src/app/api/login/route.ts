import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { userPayload } from "@/features/desk-account/payload";
import { startDeskSession } from "@/features/desk-account/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

// RustDesk's account login, answered by the panel: the app signs in with the same e-mail and
// password as the website. Field names are the ones the client sends and reads, so they cannot
// be renamed (flutter/lib/models/user_model.dart, common/hbbs/hbbs.dart).
const LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60_000;
const WRONG_CREDENTIALS = "E-posta veya şifre hatalı.";
const REMOVED_ACCOUNT = "Bu hesap kapatılmış. Firma yetkilinizle görüşün.";

const DUMMY_HASH = hashPassword("gotech-timing-equalizer");

const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(1),
  password: z.string().min(1),
});

const fail = (error: string, status = 401) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Geçersiz istek.", 400);
  const { username, password } = parsed.data;

  if (isRateLimited(`desk-login:${await clientIp()}:${username}`, LOGIN_ATTEMPTS, LOGIN_WINDOW_MS)) {
    return fail("Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin.", 429);
  }

  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.email, username)).limit(1);
  const valid = await verifyPassword(password, user?.passwordHash ?? (await DUMMY_HASH));
  if (!user?.passwordHash || !valid) return fail(WRONG_CREDENTIALS);
  // checked after the password so a wrong guess still cannot tell the two cases apart
  if (user.removedAt) return fail(REMOVED_ACCOUNT);

  const token = await startDeskSession(user.id);
  return Response.json({ access_token: token, type: "access_token", user: userPayload(user) });
}
