import { count, inArray } from "drizzle-orm";
import { encryptSecret } from "@/lib/desk/crypto";
import type { Database } from "./index";
import { companies, devices } from "./schema";
import { hoursAgo } from "./seed-helpers";

const KAVURMA = "Kavurma Atölyesi";
const NOVA = "Nova Diş Kliniği";
const DAY_HOURS = 24;

export async function seedDevices(db: Database) {
  const [{ value: deviceCount }] = await db.select({ value: count() }).from(devices);
  if (deviceCount > 0) return;

  const rows = await db.select({ id: companies.id, name: companies.name }).from(companies).where(inArray(companies.name, [KAVURMA, NOVA]));
  const kavurma = rows.find((c) => c.name === KAVURMA);
  const nova = rows.find((c) => c.name === NOVA);
  if (!kavurma || !nova) return;

  await db.insert(devices).values([
    // a real GoTech Desk installation, online whenever that Mac has the app open
    { companyId: kavurma.id, deskId: "201369773", hostname: "Kavurma-MacBook", platform: "macos", appVersion: "1.4.2", registeredAt: hoursAgo(12 * DAY_HOURS), lastRegisteredAt: hoursAgo(2) },
    // not a real installation, always offline
    { companyId: nova.id, deskId: "123456789", hostname: "RESEPSIYON-PC", platform: "windows", appVersion: "1.4.1", unattendedPasswordEnc: encryptSecret("nova-gozetimsiz-1"), registeredAt: hoursAgo(40 * DAY_HOURS), lastRegisteredAt: hoursAgo(5 * DAY_HOURS) },
  ]);
  console.info("[seed] Demo cihazları oluşturuldu.");
}
