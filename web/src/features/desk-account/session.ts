import "server-only";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, users, type User } from "@/db/schema";
import { hashToken, newToken } from "@/lib/auth/tokens";

// The desktop app signs in with the same account as the panel, but it cannot hold a cookie, so it
// carries the session token in an Authorization header. Same sessions table: removing a person or
// ending their sessions logs the app out too.
const APP_SESSION_DAYS = 30;
const DAY_MS = 86_400_000;
const BEARER = /^Bearer\s+(.+)$/i;

export type DeskAccountUser = Pick<User, "id" | "name" | "email" | "role" | "companyId">;

export async function startDeskSession(userId: string): Promise<string> {
  const token = newToken();
  const db = await getDb();
  await db.insert(sessions).values({
    id: hashToken(token),
    userId,
    expiresAt: new Date(Date.now() + APP_SESSION_DAYS * DAY_MS),
  });
  return token;
}

export async function endDeskSession(token: string) {
  const db = await getDb();
  await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
}

export const deskSessionToken = (request: Request) => BEARER.exec(request.headers.get("authorization") ?? "")?.[1]?.trim() ?? null;

/** The signed-in person behind an app request, or null when the token is missing, expired or revoked. */
export async function deskAccountUser(request: Request): Promise<DeskAccountUser | null> {
  const token = deskSessionToken(request);
  if (!token) return null;
  const db = await getDb();
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, companyId: users.companyId })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date()), isNull(users.removedAt)))
    .limit(1);
  return user ?? null;
}
