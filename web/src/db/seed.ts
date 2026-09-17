import { count } from "drizzle-orm";
import { newCustomerCode } from "@/features/customers/customer-code";
import { hashPassword } from "@/lib/auth/password";
import type { Database } from "./index";
import { companies, users } from "./schema";
import { seedDevices } from "./seed-devices";
import { hoursAgo } from "./seed-helpers";
import { seedSupport } from "./seed-support";
import { seedWork } from "./seed-work";

// Shown on the login page in development so the panels can be tried right away.
export const DEMO_ACCOUNTS = {
  staff: { email: "ekip@gotech.local", password: "gotech-demo-1" },
  customer: { email: "ayse@kavurma.example", password: "musteri-demo-1" },
};

export async function seedDemoData(db: Database) {
  const [{ value: userCount }] = await db.select({ value: count() }).from(users);
  if (userCount === 0) await seedAccountsAndWork(db);
  // separate guard so databases seeded before remote support existed get demo computers too
  await seedDevices(db);
}

async function seedAccountsAndWork(db: Database) {
  const staffHash = await hashPassword(DEMO_ACCOUNTS.staff.password);
  const customerHash = await hashPassword(DEMO_ACCOUNTS.customer.password);

  const [deniz, can, elif] = await db
    .insert(users)
    .values([
      { name: "Deniz Arslan", email: DEMO_ACCOUNTS.staff.email, role: "staff", title: "Destek ekibi lideri", passwordHash: staffHash },
      { name: "Can Demir", email: "can@gotech.local", role: "staff", title: "Yazılım geliştirici", passwordHash: staffHash },
      { name: "Elif Koç", email: "elif@gotech.local", role: "staff", title: "Proje yöneticisi", passwordHash: staffHash },
    ])
    .returning();

  const [kavurma] = await db
    .insert(companies)
    .values({ name: "Kavurma Atölyesi", customerCode: await newCustomerCode(db), createdAt: hoursAgo(24 * 220) })
    .returning();
  const [nova] = await db
    .insert(companies)
    .values({ name: "Nova Diş Kliniği", customerCode: await newCustomerCode(db), createdAt: hoursAgo(24 * 70) })
    .returning();

  const [ayse, emre, , burak] = await db
    .insert(users)
    .values([
      // the first person of each company is its firma yetkilisi
      { name: "Ayşe Kaya", email: DEMO_ACCOUNTS.customer.email, role: "customer", companyId: kavurma.id, title: "Kurucu", phone: "0532 111 22 33", passwordHash: customerHash, isCompanyAdmin: true },
      { name: "Emre Şahin", email: "emre@kavurma.example", role: "customer", companyId: kavurma.id, title: "Depo sorumlusu", passwordHash: customerHash },
      // invited, has not set a password yet
      { name: "Selin Aksoy", email: "selin@kavurma.example", role: "customer", companyId: kavurma.id, title: "Muhasebe" },
      { name: "Burak Yıldız", email: "burak@novadis.example", role: "customer", companyId: nova.id, title: "Klinik müdürü", passwordHash: customerHash, isCompanyAdmin: true },
    ])
    .returning();

  const people = { deniz, can, elif, ayse, emre, burak };
  await seedSupport(db, { kavurma, nova }, people);
  await seedWork(db, { kavurma, nova }, people);

  console.info("[seed] Demo verisi oluşturuldu. Ekip: %s, müşteri: %s", DEMO_ACCOUNTS.staff.email, DEMO_ACCOUNTS.customer.email);
}
