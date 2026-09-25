// Mikro ürün ailesi. Ana sayfadaki kademe kartları ve /urunler sayfası aynı kaynaktan besleniyor;
// hangi üründe ne olduğu (özellik karşılaştırması, artılar/eksikler) karsilastirma.ts'te.

import type { CompareId } from "./karsilastirma";

export type ProductCategory = "micro" | "kobi" | "enterprise";

export type Product = {
  id: CompareId;
  name: string;
  category: ProductCategory;
  // kademe kartındaki "Ölçek" satırı
  scale: string;
  // kademe kartındaki kısa açıklama
  blurb: string;
  // /urunler sayfasındaki uzun açıklama
  description: string;
  // ürünün kendi sayfası (Jump'ın sürümleri Jump sayfasındaki kartlarına iner)
  page: string;
};

export const CATEGORIES: { id: "all" | ProductCategory; name: string }[] = [
  { id: "all", name: "Tümü" },
  { id: "micro", name: "Küçük işletme" },
  { id: "kobi", name: "KOBİ" },
  { id: "enterprise", name: "Kurumsal" },
];

export const PRODUCTS: Product[] = [
  {
    id: "mikro-jump-basic",
    name: "Mikro Jump Basic",
    category: "micro",
    scale: "3 kullanıcıya kadar",
    blurb: "Ön muhasebeden fazlasını isteyen küçük işletmeler için ara ERP. e-Fatura, e-Arşiv, e-İrsaliye programın içinden.",
    description:
      "Ön muhasebeden daha fazlasını isteyen, büyümeye başlayan işletmeler için ara ERP çözümü. 3 kullanıcıya kadar eş zamanlı çalışılır.",
    page: "/urunler/mikro-jump#basic",
  },
  {
    id: "mikro-jump",
    name: "Mikro Jump",
    category: "kobi",
    scale: "5-50 çalışan",
    blurb: "KOBİ'ler için kapsamlı ERP. İşiniz büyüdükçe yazılımınız da sizinle büyür.",
    description:
      "Küçük ve orta ölçekli işletmeler için kapsamlı ERP çözümü. Satış, stok, muhasebe ve üretim aynı yerde çalışır.",
    page: "/urunler/mikro-jump",
  },
  {
    id: "mikro-jump-bulut",
    name: "Mikro Jump Bulut",
    category: "kobi",
    scale: "1-20 çalışan",
    blurb: "Mikro Jump'ın bulut sürümü. Sunucu ve kurulum olmadan, internet olan her yerden.",
    description:
      "Mikro Jump'ın tarayıcıdan çalışan bulut sürümü. Sunucu, kurulum ve donanım yatırımı gerekmez; yedekleme ve bakım otomatik ilerler.",
    page: "/urunler/mikro-jump#bulut",
  },
  {
    id: "mikro-fly",
    name: "Mikro Fly",
    category: "enterprise",
    scale: "50+ çalışan",
    blurb: "Grup şirketleri ve holdingler için tam entegre kurumsal ERP platformu.",
    description:
      "Büyük ölçekli işletmeler, grup şirketleri ve holdingler için tam entegre kurumsal ERP platformu.",
    page: "/urunler/mikro-fly",
  },
];

export const EDONUSUM_DOCS = ["e-Fatura", "e-Arşiv", "e-İrsaliye", "e-Defter", "e-Mutabakat", "e-SMM", "e-Müstahsil", "e-Bordro"];

export const EDONUSUM_CONSULTING = ["GİB başvuruları", "Sistem kurulumu", "Entegratör bağlantısı", "Zorunlu belgelerin tespiti"];

export const SERVICES = [
  { title: "İş analizi", body: "İhtiyaçlarınızı detaylı analiz ederek en uygun çözümü belirliyoruz.", ticks: ["Mevcut süreç analizi", "İhtiyaç tespiti", "Çözüm önerisi", "Maliyet analizi"] },
  { title: "Kurulum & entegrasyon", body: "Yazılımınızı profesyonelce kuruyor, mevcut sistemlerinizle entegre ediyoruz.", ticks: ["Yazılım kurulumu", "Sistem entegrasyonu", "Özelleştirme"] },
  { title: "Eğitim", body: "Ekibinizin programı kendi işleri üzerinden öğrenmesini sağlıyoruz.", ticks: ["Kullanıcı eğitimi", "Yönetici eğitimi"] },
  { title: "Teknik destek", body: "Çalışma saatlerimizde uzak bağlantı ve destek portalıyla yanınızdayız; gerektiğinde yerinde.", ticks: ["Uzak bağlantı (GoTech Desk)", "Destek portalı", "Yerinde destek"] },
  { title: "e-Dönüşüm danışmanlığı", body: "e-Fatura, e-Defter ve tüm e-belge süreçlerinizde danışmanlık.", ticks: ["GİB başvuruları", "Sistem kurulumu", "Entegratör bağlantısı", "Zorunlu belgelerin tespiti"] },
];

export const PROCESS_STEPS = [
  { title: "İletişim", body: "Bize ulaşın, ihtiyaçlarınızı dinleyelim." },
  { title: "Analiz", body: "İşletmenizi ve süreçlerinizi analiz edelim." },
  { title: "Teklif", body: "Size özel çözüm ve fiyat sunalım." },
  { title: "Kurulum", body: "Kuralım, entegre edelim." },
  { title: "Eğitim", body: "Ekibinizi kullanıcı ve yönetici eğitimleriyle hazırlayalım." },
  { title: "Destek", body: "Destek, güncelleme ve bakımla yanınızda olalım." },
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
    a: "Mikro Yazılım İş Ortağı'yız. 2017'den beri Mikro Yazılım'ın ERP ürünlerini işletmelere kuruyor, iş analizinden eğitime ve teknik desteğe kadar sürecin tamamında yanınızda oluyoruz.",
  },
  {
    q: "Hangi ürün bize uygun?",
    a: "Programı aynı anda kaç kişinin kullanacağına ve ihtiyacınıza göre değişir: 3 kullanıcıya kadar Mikro Jump Basic, 5-50 çalışanlı işletmeler için Mikro Jump, 50'den fazla çalışan ve grup şirketleri için Mikro Fly. Programa internet olan her yerden erişmek istiyorsanız Mikro Jump Bulut var.",
  },
  {
    q: "e-Fatura ve e-Defter programın içinde mi?",
    a: "Evet, ayrı bir yazılım gerekmez; belgeler Mikro'nun içinden kesilir, e-dönüşüm kontörü teklifte ayrı kalemdir. Jump Basic'te e-Fatura, e-Arşiv, e-İrsaliye ve e-Müstahsil var. Jump ve Jump Bulut'ta e-Defter ve e-Bordro ilgili modüllerle (genel muhasebe, personel), Fly'da ana paketle kullanılır. GİB başvurusunu ve entegratör bağlantısını biz yapıyoruz.",
  },
  {
    q: "Kurulumdan sonra destek veriyor musunuz?",
    a: "Evet. Çalışma saatlerimizde GoTech Desk ile uzak bağlantı ve destek portalı üzerinden destek veriyoruz; gerektiğinde yerinde destek de var.",
  },
  {
    q: "Depomuzla ya da bayilerimizle entegre olur mu?",
    a: "Olur. Depo için Zeus WMS'i, bayi ve saha satış için B2B/B4B çözümlerini kurup Mikro'ya bağlıyoruz.",
  },
];
