import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db";
import { sessions, users, type User, type UserRole } from "@/db/schema";
import { env } from "@/lib/env";
import { hashToken, newToken } from "./tokens";

const SESSION_COOKIE = "gt_session";
const SESSION_DAYS = 30;
const DAY_MS = 86_400_000;

export type SessionUser = Pick<User, "id" | "name" | "email" | "role" | "companyId">;
export type CustomerUser = SessionUser & { companyId: string };

export const homeFor = (role: UserRole) => (role === "staff" ? "/yonetim" : "/panel");

export async function startSession(userId: string) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
  const db = await getDb();
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { httpOnly: true, secure: env.isProduction, sameSite: "lax", path: "/", expires: expiresAt });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, companyId: users.companyId })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return user ?? null;
});

export async function requireStaff(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");
  if (user.role !== "staff") redirect(homeFor(user.role));
  return user;
}

export async function requireCustomer(): Promise<CustomerUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");
  if (user.role !== "customer") redirect(homeFor(user.role));
  if (!user.companyId) throw new Error(`Customer ${user.id} has no company`);
  return { ...user, companyId: user.companyId };
}
