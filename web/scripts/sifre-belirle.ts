// Bir kullanicinin sifresini elle belirler. Panelin kendi hashPassword'unu
// kullanir, yani uretilen kayit normal giristekiyle birebir ayni bicimde olur.
//
// Kullanim:
//   pnpm tsx --env-file-if-exists=.env scripts/sifre-belirle.ts <e-posta> <yeni sifre>
//
// Sifre degistiginde acik oturumlar kapatilir; kullanici her yerde yeniden
// giris yapmak zorunda kalir.
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/auth/password";

const [eposta, sifre] = process.argv.slice(2);

if (!eposta || !sifre) {
  console.error("Kullanim: tsx scripts/sifre-belirle.ts <e-posta> <yeni sifre>");
  process.exit(2);
}
if (sifre.length < MIN_PASSWORD_LENGTH) {
  console.error(`Sifre en az ${MIN_PASSWORD_LENGTH} karakter olmali (verilen: ${sifre.length}).`);
  process.exit(2);
}

const db = await getDb();
const [kullanici] = await db
  .select({ id: users.id, name: users.name, role: users.role })
  .from(users)
  .where(eq(users.email, eposta.toLowerCase().trim()));

if (!kullanici) {
  console.error(`Boyle bir kullanici yok: ${eposta}`);
  process.exit(1);
}

await db.update(users).set({ passwordHash: await hashPassword(sifre) }).where(eq(users.id, kullanici.id));
const kapatilan = await db.delete(sessions).where(eq(sessions.userId, kullanici.id)).returning({ id: sessions.id });

console.log(`Sifre guncellendi: ${kullanici.name} (${kullanici.role})`);
console.log(`Kapatilan acik oturum: ${kapatilan.length}`);
console.log("Kullanici artik yeni sifreyle girebilir.");

process.exit(0);
