/*
 * Creates a GoTech team account and prints a one-time link for setting its password.
 * Usage: pnpm create-staff "Ad Soyad" ad@gotech.com.tr
 * With the embedded development database, stop `pnpm dev` first: PGlite allows one process at a time.
 */
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { passwordTokens, users } from "@/db/schema";
import { hashToken, newToken } from "@/lib/auth/tokens";
import { env } from "@/lib/env";

const LINK_HOURS = 72;
const HOUR_MS = 3_600_000;

async function main() {
  const [name, rawEmail] = process.argv.slice(2);
  const email = rawEmail?.trim().toLowerCase();
  if (!name || !email?.includes("@")) {
    console.error('Kullanım: pnpm create-staff "Ad Soyad" ad@firma.com');
    process.exit(1);
  }

  const db = await getDb();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) {
    console.error(`${email} ile kayıtlı bir kullanıcı zaten var.`);
    process.exit(1);
  }

  const [user] = await db.insert(users).values({ name, email, role: "staff" }).returning();
  const token = newToken();
  await db.insert(passwordTokens).values({ id: hashToken(token), userId: user.id, expiresAt: new Date(Date.now() + LINK_HOURS * HOUR_MS) });

  console.info(`${name} (${email}) ekip üyesi olarak eklendi.`);
  console.info(`Şifre belirleme bağlantısı (${LINK_HOURS} saat geçerli):\n${env.siteUrl}/sifre-belirle?token=${token}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
