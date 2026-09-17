import { dayOffset } from "@/lib/dates";
import type { Database } from "./index";
import { documents, projectMilestones, projects } from "./schema";
import { hoursAgo, type SeedCompanies, type SeedPeople } from "./seed-helpers";

const done = (daysAgo: number) => hoursAgo(daysAgo * 24);

export async function seedWork(db: Database, { kavurma, nova }: SeedCompanies, p: SeedPeople) {
  const [erp, shop, booking] = await db
    .insert(projects)
    .values([
      { companyId: kavurma.id, name: "Mikro ERP kurulumu", service: "erp", stage: "live", summary: "Stok, cari hesap, sipariş ve e-Fatura modülleri. Canlıda, aylık bakım anlaşmasıyla destekleniyor.", startsOn: dayOffset(-210), dueOn: dayOffset(-120) },
      { companyId: kavurma.id, name: "E-ticaret sitesi yenileme", service: "web", stage: "development", summary: "Yeni tasarım, ERP ile eş zamanlı stok ve sipariş aktarımı.", startsOn: dayOffset(-45), dueOn: dayOffset(30) },
      { companyId: nova.id, name: "Online randevu sistemi", service: "panel", stage: "testing", summary: "Web sitesinden randevu, hekim takvimleri ve SMS hatırlatma.", startsOn: dayOffset(-60), dueOn: dayOffset(7) },
    ])
    .returning();

  await db.insert(projectMilestones).values([
    ...["Keşif ve kapsam", "Ekran tasarımları", "Stok ve cari modülleri", "e-Fatura entegrasyonu", "Eğitim ve canlıya alma"].map((title, i) => ({
      projectId: erp.id, title, position: i, dueOn: dayOffset(-200 + i * 20), completedAt: done(198 - i * 20),
    })),
    { projectId: shop.id, title: "Keşif toplantısı", position: 0, dueOn: dayOffset(-40), completedAt: done(40) },
    { projectId: shop.id, title: "Tasarım onayı", position: 1, dueOn: dayOffset(-20), completedAt: done(21) },
    { projectId: shop.id, title: "Ürün sayfaları ve sepet", position: 2, dueOn: dayOffset(5) },
    { projectId: shop.id, title: "ERP stok entegrasyonu", position: 3, dueOn: dayOffset(15) },
    { projectId: shop.id, title: "Test ve yayına alma", position: 4, dueOn: dayOffset(30) },
    { projectId: booking.id, title: "Keşif ve kapsam", position: 0, dueOn: dayOffset(-55), completedAt: done(56) },
    { projectId: booking.id, title: "Ekran tasarımları", position: 1, dueOn: dayOffset(-40), completedAt: done(38) },
    { projectId: booking.id, title: "Randevu paneli", position: 2, dueOn: dayOffset(-10), completedAt: done(9) },
    { projectId: booking.id, title: "SMS hatırlatma", position: 3, dueOn: dayOffset(2) },
    { projectId: booking.id, title: "Klinikte eğitim", position: 4, dueOn: dayOffset(7) },
  ]);

  await db.insert(documents).values([
    { companyId: kavurma.id, title: "Hizmet sözleşmesi", kind: "contract", fileName: "hizmet-sozlesmesi.pdf", sizeBytes: 248_000, uploadedById: p.elif.id, createdAt: done(205) },
    { companyId: kavurma.id, projectId: erp.id, title: "Mikro ERP kullanım kılavuzu", kind: "guide", fileName: "erp-kullanim-kilavuzu.pdf", sizeBytes: 2_400_000, uploadedById: p.can.id, createdAt: done(120) },
    { companyId: kavurma.id, projectId: shop.id, title: "E-ticaret sitesi teklifi", kind: "proposal", fileName: "eticaret-teklifi.pdf", sizeBytes: 412_000, uploadedById: p.elif.id, createdAt: done(50) },
    { companyId: kavurma.id, title: "Ağustos bakım raporu", kind: "report", fileName: "agustos-bakim-raporu.pdf", sizeBytes: 186_000, uploadedById: p.deniz.id, createdAt: done(12) },
    { companyId: nova.id, title: "Hizmet sözleşmesi", kind: "contract", fileName: "hizmet-sozlesmesi.pdf", sizeBytes: 251_000, uploadedById: p.elif.id, createdAt: done(62) },
    { companyId: nova.id, projectId: booking.id, title: "Randevu sistemi ekran tasarımları", kind: "report", fileName: "randevu-ekran-tasarimlari.pdf", sizeBytes: 3_100_000, uploadedById: p.can.id, createdAt: done(38) },
  ]);
}
