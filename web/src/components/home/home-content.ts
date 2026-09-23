// Ana sayfaya özel sabit metinler. Panelden düzenlenenler (hero, rakamlar, iletişim, alt bilgi)
// kurumsal/content.ts + getSiteConfig'ten; ürün ve hizmetler kurumsal/urunler-data.ts'ten geliyor.

import type { IconName } from "./icons";

export const NAV_LINKS = [
  { href: "#urunler", label: "Ürünler" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#destek", label: "Destek" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#sss", label: "SSS" },
];

export const PORTAL_HREF = "/giris";

// Üst bant: V16'nın destek bitiş tarihi. Bant kalan günü yazar, tarih geçince "sona erdi"ye döner.
export const V16_END = { iso: "2026-10-15", label: "15 Ekim 2026" };

export const HERO_TRUST = [
  { value: "2017", rest: "'den beri" },
  { value: "500+", rest: " işletme" },
  { value: "Silver", rest: " Partner" },
];

// urunler-data.ts SERVICES sırasıyla
export const SERVICE_ICONS: IconName[] = ["search", "plug", "grad", "head", "refresh", "file"];

// urunler-data.ts EDONUSUM_DOCS'taki her belge için tek satır
export const EDONUSUM_NOTES: Record<string, string> = {
  "e-Fatura": "Kayıtlı kullanıcılara kesilen fatura",
  "e-Arşiv": "e-Fatura kullanmayan alıcılara fatura",
  "e-İrsaliye": "Sevk irsaliyesinin elektronik hâli",
  "e-Defter": "Yevmiye, büyük defter ve berat",
  "e-Mutabakat": "Cari ve Ba/Bs mutabakatı",
  "e-SMM": "Serbest meslek makbuzu",
  "e-Müstahsil": "Çiftçiden alımlarda makbuz",
  "e-Bordro": "Bordroların elektronik gönderimi",
};

export type IconCardItem = { icon: IconName; title: string; body: string };

// Türkiye'deki rakiplerde "bayi değişimi" sayfası var; bizde ana sayfada.
export const MIGRATION: IconCardItem[] = [
  {
    icon: "swap",
    title: "İş ortağınızı değiştirmek",
    body: "Mikro'yu başka bir iş ortağından aldıysanız desteği bize taşıyabilirsiniz. Lisansınız ve verileriniz sizde kalır; kurulumunuzun bakımını devralıyoruz.",
  },
  {
    icon: "up",
    title: "V16'dan geçiş",
    body: `V16 desteği ${V16_END.label}'da bitiyor. Mevcut kurulumunuzu inceleyip geçişi yoğun döneme denk gelmeyecek şekilde takvime bağlıyoruz.`,
  },
  {
    icon: "layout",
    title: "Özel rapor ve ekranlarınız",
    body: "Size özel yazılmış rapor ve ekranları geçişte kaybetmeyin. Yeni sürümde çalışıp çalışmadığını kontrol ediyor, gerekeni kendi yazılım ekibimizle uyarlıyoruz.",
  },
];

// Lead formundaki konu (features/leads/labels.ts): "Kurulumunuzu inceleyelim" butonu bunu seçili getirir
export const MIGRATION_TOPIC = "gecis";

export const SUPPORT: IconCardItem[] = [
  { icon: "phone", title: "Destek hattı", body: "Günün her saati ulaşabileceğiniz destek hattı." },
  { icon: "monitor", title: "Uzak bağlantı", body: "Bilgisayarınıza tek tıkla bağlanıp sorunu ekranınızda çözüyoruz." },
  { icon: "pin", title: "Yerinde destek", body: "Gerektiğinde İzmir ve çevresinde işletmenize geliyoruz." },
  { icon: "msg", title: "Destek portalı", body: "Talebinizi açın; kimin üstlendiğini ve hangi aşamada olduğunu görün." },
];

export const BEYOND = [
  {
    id: "ozel-gelistirme",
    icon: "plug" as IconName,
    title: "Mikro'ya özel geliştirme",
    body: "Mikro'ya entegre çalışan ek ekranlar, özel raporlar ve bağlantılar yazıyoruz. Verileriniz yine Mikro'da kalır.",
    items: [
      { title: "İşletmenize özel ekran ve rapor" },
      { title: "Bayi sipariş portalı ve saha satış" },
      { title: "Pazaryeri bağlantısı", note: "Trendyol, Hepsiburada, N11" },
      { title: "Ek çözümler", note: "Zeus WMS, Mikro Hızlı Satış, Mikro Drive" },
    ],
  },
  {
    id: "bagimsiz",
    icon: "monitor" as IconName,
    title: "Mikro'dan bağımsız yazılım",
    body: "Web sitesi, e-ticaret, müşteri veya bayi portalı gibi ERP dışı işleri de biz yapıyoruz. Ayrı bir firmayla uğraşmanız gerekmiyor.",
    items: [
      { title: "Kurumsal web sitesi" },
      { title: "E-ticaret", note: "Mikro'ya bağlı ya da bağımsız" },
      { title: "Müşteri ve bayi portalları" },
      { title: "Ekip ve saha panelleri" },
    ],
  },
];

export const HOME_FAQ = [
  {
    q: "Excel'deki verilerimizi aktarabilir miyiz?",
    a: "Evet. Cari, stok ve ürün listelerinizi kurulum sırasında sisteme aktarıyoruz. Kullandığınız eski programdan da veri alabiliyoruz.",
  },
  {
    q: "Kurulum ne kadar sürer?",
    a: "Ürüne, modül sayısına ve veri miktarına göre değişiyor. Keşif görüşmesinden sonra 24 saat içinde yazılı teklif ve takvim veriyoruz.",
  },
  {
    q: "Fiyat neye göre belirleniyor?",
    a: "Kullanıcı lisansı, kurulum ve veri aktarımı, yıllık bakım ve e-dönüşüm kontörü. Dördünü de teklifte ayrı ayrı görüyorsunuz, sürpriz kalem çıkmıyor.",
  },
  {
    q: "V16 kullanıyoruz, ne yapmalıyız?",
    a: `V16 için geliştirme ve destek ${V16_END.label}'da sona eriyor. Geçişi erkenden planlamak, yoğun döneme denk gelmemek açısından önemli. Mevcut kurulumunuzu inceleyip takvim çıkarıyoruz.`,
  },
  {
    q: "Kurulumdan sonra desteği kim veriyor?",
    a: "Sistemi kuran ekip. Destek portalından talep açıyorsunuz; talebinizi kimin üstlendiğini ve hangi aşamada olduğunu oradan takip ediyorsunuz.",
  },
];
