// Mikro ürün ailesi. Ana sayfadaki kademe kartları ve /urunler sayfası aynı kaynaktan besleniyor.

export type ProductCategory = "micro" | "kobi" | "enterprise" | "musavir";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  // kademe kartındaki "Ölçek" satırı
  scale: string;
  // kademe kartındaki kısa açıklama
  blurb: string;
  // /urunler sayfasındaki uzun açıklama
  description: string;
  popular?: boolean;
  modules: string[];
  features: string[];
};

export const CATEGORIES: { id: "all" | ProductCategory; name: string }[] = [
  { id: "all", name: "Tümü" },
  { id: "micro", name: "Mikro işletme" },
  { id: "kobi", name: "KOBİ" },
  { id: "enterprise", name: "Kurumsal" },
  { id: "musavir", name: "Mali müşavir" },
];

export const PRODUCTS: Product[] = [
  {
    id: "mikro-run",
    name: "Mikro Run",
    category: "micro",
    scale: "1-5 çalışan",
    blurb: "Esnaf ve mikro işletmeler için ekonomik ERP. e-Dönüşüm paketi dahil gelir.",
    description:
      "Esnaf, serbest meslek sahibi ve mikro işletmeler için kolay kullanımlı, ekonomik ERP çözümü. e-Dönüşüm paketi ürünün içinde gelir.",
    modules: ["Faturalama", "Stok takibi", "e-Dönüşüm", "Raporlar"],
    features: [
      "Stok ve cari takibi",
      "Fatura ve irsaliye",
      "e-Fatura, e-Arşiv, e-İrsaliye",
      "Gelir-gider takibi",
      "Temel raporlama",
      "Bulut yedekleme",
    ],
  },
  {
    id: "mikro-jump",
    name: "Mikro Jump",
    category: "kobi",
    scale: "5-50 çalışan",
    blurb: "KOBİ'ler için kapsamlı ERP. İşiniz büyüdükçe yazılımınız da sizinle büyür.",
    description:
      "Küçük ve orta ölçekli işletmeler için kapsamlı ERP çözümü. Satış, stok, muhasebe ve üretim aynı yerde çalışır.",
    popular: true,
    modules: ["Satış yönetimi", "Depo yönetimi", "Muhasebe", "Üretim"],
    features: [
      "Satış ve satın alma yönetimi",
      "Stok ve depo yönetimi",
      "Cari hesap takibi",
      "Muhasebe entegrasyonu",
      "Üretim takibi",
      "Personel yönetimi",
      "e-Dönüşüm (tümü)",
      "Detaylı raporlama",
      "Çoklu şube desteği",
      "Banka entegrasyonu",
    ],
  },
  {
    id: "mikro-fly",
    name: "Mikro Fly",
    category: "enterprise",
    scale: "50+ çalışan",
    blurb: "Grup şirketleri ve holdingler için tam entegre kurumsal ERP platformu.",
    description:
      "Büyük ölçekli işletmeler, grup şirketleri ve holdingler için tam entegre kurumsal ERP platformu.",
    modules: ["Holding yönetimi", "İş zekası", "İnsan kaynakları", "Üretim planlama"],
    features: [
      "Çoklu şirket yönetimi",
      "Konsolidasyon",
      "İleri düzey raporlama",
      "İş zekası ve dashboard",
      "Workflow yönetimi",
      "İnsan kaynakları",
      "Üretim planlama (MRP)",
      "Kalite yönetimi",
      "Proje yönetimi",
      "API entegrasyonları",
      "Tam e-Dönüşüm",
      "Özelleştirilebilir modüller",
    ],
  },
  {
    id: "mikro-musavir",
    name: "Mikro Müşavir",
    category: "musavir",
    scale: "Mali müşavirler",
    blurb: "Mükellef yönetimini kolaylaştıran, müşavirler için profesyonel çözüm.",
    description:
      "Serbest muhasebeciler ve mali müşavirler için tasarlanmış, mükellef yönetimini kolaylaştıran profesyonel çözüm.",
    modules: ["Defter beyan", "Mükellef yönetimi", "e-SMM", "Beyannameler"],
    features: [
      "Sınırsız mükellef tanımlama",
      "Genel muhasebe",
      "İşletme defteri",
      "Defter beyan entegrasyonu",
      "e-SMM yönetimi",
      "Belge alışverişi",
      "Amortisman takibi",
      "Beyanname hazırlama",
      "Mükellef raporları",
    ],
  },
];

export const EDONUSUM_DOCS = ["e-Fatura", "e-Arşiv", "e-İrsaliye", "e-Defter", "e-Mutabakat", "e-SMM", "e-Müstahsil", "e-Bordro"];

export const EDONUSUM_CONSULTING = ["GİB başvuruları", "Sistem kurulumu", "Entegratör bağlantısı", "Yasal uyumluluk takibi"];

export const SERVICES = [
  { title: "İş analizi", body: "İhtiyaçlarınızı detaylı analiz ederek en uygun çözümü belirliyoruz.", ticks: ["Mevcut süreç analizi", "İhtiyaç tespiti", "Çözüm önerisi", "Maliyet analizi"] },
  { title: "Kurulum & entegrasyon", body: "Yazılımınızı profesyonelce kuruyor, mevcut sistemlerinizle entegre ediyoruz.", ticks: ["Yazılım kurulumu", "Veri aktarımı", "Sistem entegrasyonu", "Özelleştirme"] },
  { title: "Eğitim", body: "Ekibinizi yazılımı etkin kullanabilmeleri için kapsamlı eğitimlerle donatıyoruz.", ticks: ["Kullanıcı eğitimi", "Yönetici eğitimi", "Online eğitim", "Eğitim dokümanları"] },
  { title: "Teknik destek", body: "7/24 teknik destek hizmetimizle her an yanınızdayız.", ticks: ["Telefon desteği", "Uzaktan erişim", "Yerinde destek", "Öncelikli müdahale"] },
  { title: "Güncelleme & bakım", body: "Yazılımınızı güncel tutuyor, performansını sürekli izliyoruz.", ticks: ["Versiyon güncellemesi", "Güvenlik yamaları", "Performans optimizasyonu", "Yedekleme"] },
  { title: "e-Dönüşüm danışmanlığı", body: "e-Fatura, e-Defter ve tüm e-belge süreçlerinizde uzman danışmanlık.", ticks: ["GİB başvuruları", "Sistem kurulumu", "Entegratör bağlantısı", "Yasal uyumluluk"] },
];

export const PROCESS_STEPS = [
  { title: "İletişim", body: "Bize ulaşın, ihtiyaçlarınızı dinleyelim." },
  { title: "Analiz", body: "İşletmenizi ve süreçlerinizi analiz edelim." },
  { title: "Teklif", body: "Size özel çözüm ve fiyat sunalım." },
  { title: "Kurulum", body: "Kuralım, verilerinizi aktaralım, entegre edelim." },
  { title: "Eğitim", body: "Ekibinizi kullanıcı ve yönetici eğitimleriyle hazırlayalım." },
  { title: "Destek", body: "7/24 destek, güncelleme ve bakımla yanınızda olalım." },
];

export const EXTRA_SOLUTIONS = [
  { title: "Zeus WMS", body: "Yapay zeka destekli depo yönetim sistemi.", chips: ["Stok takibi", "Raf yönetimi", "Barkod", "SKT takibi"] },
  { title: "B2B / B4B", body: "Bayi ve saha satış yönetim sistemi.", chips: ["Online sipariş", "Bayi portalı", "Saha satış", "Mobil"] },
  { title: "Mikro Hızlı Satış", body: "Perakende satış noktası (POS) çözümü.", chips: ["Hızlı satış", "Barkod okuma", "Kasa", "Z raporu"] },
  { title: "Mikro Drive", body: "Bulut yedekleme ve dosya paylaşımı.", chips: ["Otomatik yedekleme", "Dosya paylaşımı", "Güvenli depolama"] },
  { title: "Mikro Şirketim", body: "Mobil işletme yönetimi uygulaması.", chips: ["Satış raporları", "Tahsilat takibi", "Cari bakiye", "Bildirimler"] },
  { title: "E-Ticaret entegrasyonu", body: "Pazaryeri ve web mağaza entegrasyonu.", chips: ["Trendyol", "Hepsiburada", "N11", "Amazon"] },
];

export const FAQ = [
  {
    q: "GoTech tam olarak ne yapıyor?",
    a: "Mikro Yazılım İş Ortağı'yız. 2017'den beri Mikro Yazılım'ın ERP ürünlerini işletmelere kuruyor, iş analizinden eğitime ve 7/24 teknik desteğe kadar sürecin tamamında yanınızda oluyoruz.",
  },
  {
    q: "Hangi ürün bize uygun?",
    a: "İşletmenizin büyüklüğüne göre değişir: 1-5 çalışan için Mikro Run, 5-50 için Mikro Jump, 50+ ve grup şirketleri için Mikro Fly. Mali müşavirler için Mikro Müşavir var.",
  },
  {
    q: "e-Fatura ve e-Defter dahil mi?",
    a: "Mikro Jump ve Fly'da tüm e-Dönüşüm çözümleri dahildir. Mikro Run'da e-Dönüşüm paketi ürünün içinde gelir. GİB başvurusu ve entegratör bağlantısında da danışmanlık veriyoruz.",
  },
  {
    q: "Mevcut verilerimizi aktarabilir miyiz?",
    a: "Evet. Veri aktarımı kurulum hizmetimizin bir parçası. Mevcut sistemlerinizle entegrasyonu da biz yapıyoruz.",
  },
  {
    q: "Kurulumdan sonra destek veriyor musunuz?",
    a: "7/24 teknik destek veriyoruz: telefon, uzaktan erişim, yerinde destek ve öncelikli müdahale. Versiyon güncellemesi, güvenlik yamaları ve yedekleme de bakım hizmetimize dahil.",
  },
  {
    q: "E-ticaret sitemizle veya depomuzla entegre olur mu?",
    a: "Olur. Trendyol, Hepsiburada, N11 ve Amazon entegrasyonu, depo için Zeus WMS, bayi ve saha satış için B2B/B4B çözümümüz var.",
  },
];

export const COMPARISON = {
  columns: ["Mikro Run", "Mikro Jump", "Mikro Fly"],
  rows: [
    { label: "Çalışan sayısı", values: ["1-5", "5-50", "50+"] },
    { label: "Stok yönetimi", values: [true, true, true] },
    { label: "e-Dönüşüm", values: ["Temel", "Tam", "Tam"] },
    { label: "Üretim modülü", values: [false, true, true] },
    { label: "Çoklu şirket", values: [false, false, true] },
    { label: "İnsan kaynakları", values: [false, "Temel", "Gelişmiş"] },
  ] as { label: string; values: (string | boolean)[] }[],
};
