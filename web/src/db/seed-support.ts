import type { Database } from "./index";
import { leads, ticketMessages, tickets } from "./schema";
import { hoursAgo, type SeedCompanies, type SeedPeople } from "./seed-helpers";

const DAY_HOURS = 24;

export async function seedSupport(db: Database, { kavurma, nova }: SeedCompanies, p: SeedPeople) {
  const [invoiceBug, reportRequest, newUser, maintenanceInvoice, smsBug, dayOff] = await db
    .insert(tickets)
    .values([
      { companyId: kavurma.id, createdById: p.ayse.id, assigneeId: p.deniz.id, subject: "e-Fatura gönderiminde hata alıyoruz", category: "bug", priority: "high", status: "in_progress", createdAt: hoursAgo(26), updatedAt: hoursAgo(3) },
      { companyId: kavurma.id, createdById: p.emre.id, assigneeId: p.can.id, subject: "Stok raporuna tedarikçi sütunu eklenebilir mi?", category: "request", status: "waiting_customer", createdAt: hoursAgo(50), updatedAt: hoursAgo(20) },
      { companyId: kavurma.id, createdById: p.ayse.id, assigneeId: p.deniz.id, subject: "Yeni personel için kullanıcı açılması", category: "support", status: "closed", rating: 5, ratingComment: "Yarım saatte halloldu, teşekkürler.", createdAt: hoursAgo(10 * DAY_HOURS), updatedAt: hoursAgo(9 * DAY_HOURS) },
      { companyId: kavurma.id, createdById: p.ayse.id, assigneeId: p.elif.id, subject: "Ağustos bakım faturası hakkında", category: "billing", status: "closed", rating: 4, createdAt: hoursAgo(30 * DAY_HOURS), updatedAt: hoursAgo(29 * DAY_HOURS) },
      { companyId: nova.id, createdById: p.burak.id, subject: "Randevu hatırlatma SMS'i gitmiyor", category: "bug", priority: "urgent", status: "open", createdAt: hoursAgo(2), updatedAt: hoursAgo(2) },
      { companyId: nova.id, createdById: p.burak.id, assigneeId: p.elif.id, subject: "Hekim takvimine izin günü ekleme", category: "request", status: "in_progress", createdAt: hoursAgo(4 * DAY_HOURS), updatedAt: hoursAgo(DAY_HOURS) },
    ])
    .returning();

  await db.insert(ticketMessages).values([
    { ticketId: invoiceBug.id, authorId: p.ayse.id, body: "Bu sabahtan beri kestiğimiz faturalar gönderilmiyor, ekranda \"yetkilendirme hatası\" yazıyor. Bugün 12 fatura bekliyor.", createdAt: hoursAgo(26) },
    { ticketId: invoiceBug.id, authorId: p.deniz.id, body: "Entegratör tarafındaki API anahtarı yenilenmiş görünüyor, eski anahtar kullanılıyordu. Yeni anahtarı tanımladık, bekleyen faturaları tekrar gönderiyoruz.", createdAt: hoursAgo(4) },
    { ticketId: invoiceBug.id, authorId: p.deniz.id, body: "Entegratör anahtarı 90 günde bir yenileniyor. Süresi dolmadan hatırlatma kuralım.", isInternal: true, createdAt: hoursAgo(3) },
    { ticketId: reportRequest.id, authorId: p.emre.id, body: "Stok raporunda hangi ürünün hangi tedarikçiden geldiğini görmek istiyoruz. Sipariş verirken çok işimize yarar.", createdAt: hoursAgo(50) },
    { ticketId: reportRequest.id, authorId: p.can.id, body: "Eklenebilir. Bir ürünü birden fazla tedarikçiden alıyor musunuz? Öyleyse raporda hepsini mi, son alım yapılanı mı görmek istersiniz?", createdAt: hoursAgo(20) },
    { ticketId: newUser.id, authorId: p.ayse.id, body: "Depoya yeni başlayan Emre için stok ekranına erişimi olan bir kullanıcı açabilir misiniz?", createdAt: hoursAgo(10 * DAY_HOURS) },
    { ticketId: newUser.id, authorId: p.deniz.id, body: "Kullanıcı açıldı, giriş bilgileri Emre'nin e-posta adresine gönderildi. Yalnızca stok ve sipariş ekranlarını görebiliyor.", createdAt: hoursAgo(9.8 * DAY_HOURS) },
    { ticketId: maintenanceInvoice.id, authorId: p.ayse.id, body: "Ağustos bakım faturasında destek saatleri ayrı yazılmamış. Kaç saat destek kullandık?", createdAt: hoursAgo(30 * DAY_HOURS) },
    { ticketId: maintenanceInvoice.id, authorId: p.elif.id, body: "Ağustosta 6 saat destek kullandınız, pakete dahil. Aylık bakım raporunu Dokümanlar bölümüne ekledik.", createdAt: hoursAgo(29.5 * DAY_HOURS) },
    { ticketId: smsBug.id, authorId: p.burak.id, body: "Dünden beri hastalara randevu hatırlatma SMS'i gitmiyor. Bugün iki hasta randevuyu unuttu, acil bakabilir misiniz?", createdAt: hoursAgo(2) },
    { ticketId: dayOff.id, authorId: p.burak.id, body: "Hekimlerimizin izin günlerini takvime işleyebilmek istiyoruz, o günlere randevu verilmesin.", createdAt: hoursAgo(4 * DAY_HOURS) },
    { ticketId: dayOff.id, authorId: p.elif.id, body: "Takvime \"izin\" kaydı ekliyoruz. Bu hafta test ortamına koyup size haber vereceğiz.", createdAt: hoursAgo(DAY_HOURS) },
  ]);

  await db.insert(leads).values([
    { name: "Mehmet Öz", company: "Öz Yedek Parça", email: "mehmet@ozyedekparca.example", phone: "0532 000 00 00", topics: ["erp", "panel"], message: "Bayilerimizin stok ve fiyatları kendisinin görebileceği bir sistem arıyoruz. Şu an her şey Excel ve telefonla yürüyor.", consentAt: hoursAgo(6), createdAt: hoursAgo(6) },
    { name: "Selim Ateş", company: "Ateş Mobilya", email: "selim@atesmobilya.example", topics: ["web"], message: "Kataloğumuzu gösterecek, bayilerden sipariş alabilecek bir site istiyoruz.", status: "contacted", consentAt: hoursAgo(3 * DAY_HOURS), createdAt: hoursAgo(3 * DAY_HOURS) },
    { name: "Gizem Er", company: "Er Kozmetik", email: "gizem@erkozmetik.example", phone: "0555 000 00 00", topics: ["erp", "web"], message: "E-ticaret sitemizin stoklarıyla depo stoklarını eşitlemek istiyoruz.", status: "quoted", consentAt: hoursAgo(9 * DAY_HOURS), createdAt: hoursAgo(9 * DAY_HOURS) },
  ]);
}
