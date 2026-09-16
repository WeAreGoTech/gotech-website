import "server-only";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { passwordTokens } from "@/db/schema";
import { env } from "@/lib/env";
import { hashToken, newToken } from "./tokens";

const TOKEN_HOURS = 72;
const HOUR_MS = 3_600_000;

export async function createPasswordLink(userId: string): Promise<string> {
  const token = newToken();
  const db = await getDb();
  await db.insert(passwordTokens).values({ id: hashToken(token), userId, expiresAt: new Date(Date.now() + TOKEN_HOURS * HOUR_MS) });
  return `${env.siteUrl}/sifre-belirle?token=${token}`;
}

export async function findUsablePasswordToken(token: string) {
  const db = await getDb();
  const [row] = await db
    .select({ id: passwordTokens.id, userId: passwordTokens.userId })
    .from(passwordTokens)
    .where(and(eq(passwordTokens.id, hashToken(token)), isNull(passwordTokens.usedAt), gt(passwordTokens.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

export async function markPasswordTokenUsed(tokenId: string) {
  const db = await getDb();
  await db.update(passwordTokens).set({ usedAt: new Date() }).where(eq(passwordTokens.id, tokenId));
}

export const PASSWORD_LINK_HOURS = TOKEN_HOURS;
