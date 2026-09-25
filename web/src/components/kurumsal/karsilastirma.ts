// Satılan dört Mikro ürününün karşılaştırması: ürün sayfalarındaki "bir bakışta" tablosu, /urunler ve ana sayfadaki
// ürün bulucu kartları buradan besleniyor. Mikro'nun ürün sayfalarındaki (Eylül 2026) ana paket / modül / e-Dönüşüm ayrımıyla;
// Mikro'da açıkça yazmayan olumsuz iddia eklenmez (ör. Jump'ın çoklu şirket desteği ve Basic/Fly'ın bulut seçeneği belirtilmiyor,
// o yüzden bu satırlar yok). Basic'in "yok" hücreleri, özelliğin Basic sayfasında hiç geçmemesine dayanıyor.

export type CompareId = "mikro-jump-basic" | "mikro-jump" | "mikro-jump-bulut" | "mikro-fly";
// true: var · false: ürün sayfasında yok · metin: kapsamı bu ("Modül": ek paket olarak satın alınır ya da kiralanır)
export type CompareValue = boolean | string;
export type CompareRow = { label: string; values: CompareValue[]; card?: string };

export type CompareProduct = {
  id: CompareId;
  name: string;
  // başlıkta: "Mikro Jump'ta neler var, neler yok?"
  locative: string;
  page: string;
  users: string;
  pros: string[];
  cons: string[];
};

export const COMPARE_PRODUCTS: CompareProduct[] = [
  {
    id: "mikro-jump-basic",
    name: "Jump Basic",
    locative: "Jump Basic'te",
    page: "/urunler/mikro-jump#basic",
    users: "3 kullanıcı",
    pros: [
      "Seri no, parti-lot, renk/beden bazında stok takibi",
      "e-Fatura, e-Arşiv, e-İrsaliye ve e-Müstahsil programın içinden",
      "Kiralama modeli: ilk yatırım maliyeti yok",
      "Restoran, hızlı satış ve depo çözümleriyle entegre",
    ],
    cons: [
      "Genel muhasebe, personel ve üretim sunulmuyor",
      "Finans yönetimi ana pakette değil, modül olarak eklenir",
      "e-Defter ve e-Bordro sunulmuyor",
      "En fazla 3 kişi aynı anda çalışır",
    ],
  },
  {
    id: "mikro-jump",
    name: "Mikro Jump",
    locative: "Mikro Jump'ta",
    page: "/urunler/mikro-jump",
    users: "20 ek kullanıcı",
    pros: [
      "Genel muhasebe, personel ve bordro modülleri",
      "Temel üretim ve fason modülleri",
      "e-Defter ve e-Bordro'ya kadar bütün e-belgeler",
      "Modüler yapı: ihtiyaç oldukça modül eklenir",
    ],
    cons: [
      "SQL Server 2016 ve üzeri gerekir (sunucunuzda ya da bilgisayarınızda)",
      "Genel muhasebe, personel ve üretim ana pakette değil, modül",
      "Kapasite planlamalı üretim (MRP2) yok",
      "CRM, iş zekası ve gelişmiş İK yok; 20 ek kullanıcı sınırı",
    ],
  },
  {
    id: "mikro-jump-bulut",
    name: "Jump Bulut",
    locative: "Jump Bulut'ta",
    page: "/urunler/mikro-jump#bulut",
    users: "20 ek kullanıcı",
    pros: [
      "Sunucu, kurulum ve donanım yatırımı yok",
      "İnternet olan her yerden, tarayıcıyla erişim",
      "Yedekleme ve bakım otomatik",
      "Jump'ın modülleri bulutta: genel muhasebe, personel, üretim",
    ],
    cons: [
      "Çalışmak için internet bağlantısı gerekir",
      "Mikro'ya göre 1–20 çalışanlı ekipler için",
      "Kapasite planlamalı üretim (MRP2) yok",
      "CRM, iş zekası ve gelişmiş İK yok",
    ],
  },
  {
    id: "mikro-fly",
    name: "Mikro Fly",
    locative: "Mikro Fly'da",
    page: "/urunler/mikro-fly",
    users: "Sınırsız kullanıcı",
    pros: [
      "Kullanıcı sınırı yok",
      "Genel muhasebe, personel, üretim ve karar destek ana pakette",
      "CRM, iş zekası, MRP2 ve gelişmiş İK modülleri yalnız Fly'da",
      "Çok şirketli ve holding yapısı, konsolidasyon, UFRS raporlama",
    ],
    cons: ["Küçük ve orta ölçekli işletmeler için gereğinden kapsamlı olabilir; bu durumda Mikro Jump çoğu zaman yeter"],
  },
];

// değerler COMPARE_PRODUCTS sırasıyla: Basic, Jump, Bulut, Fly. card: ana sayfadaki ürün bulucu kartında görünen kısa ad
export const COMPARE_GROUPS: { title: string; rows: CompareRow[] }[] = [
  {
    title: "Ticari işlemler",
    rows: [
      { label: "Stok, satış, satın alma ve cari", values: [true, true, true, true] },
      { label: "Finans (kasa, banka, çek-senet)", values: ["Modül", true, true, true] },
      { label: "Renk/beden ve parti-lot stok takibi", values: [true, true, true, true], card: "Detaylı stok takibi" },
      { label: "Bütçe yönetimi", values: [false, true, true, true] },
      { label: "Dış ticaret (ithalat, ihracat)", values: ["Modül", "Modül", "Modül", true] },
    ],
  },
  {
    title: "Muhasebe ve personel",
    rows: [
      { label: "Genel muhasebe ve sabit kıymet", values: [false, "Modül", "Modül", true], card: "Genel muhasebe" },
      { label: "Personel, puantaj ve bordro", values: [false, "Modül", "Modül", true] },
      { label: "Gelişmiş İK (özgeçmiş, eğitim, sertifika)", values: [false, false, false, "Modül"] },
      { label: "UFRS uyumlu finansal raporlama", values: [false, false, false, "Modül"] },
    ],
  },
  {
    title: "Üretim",
    rows: [
      { label: "Üretim yönetimi", values: [false, "Temel · modül", "Temel · modül", true], card: "Üretim" },
      { label: "Fason yönetimi", values: [false, "Modül", "Modül", "Modül"] },
      { label: "İleri üretim planlama (MRP2): makine, zaman, iş gücü", values: [false, false, false, "Modül"] },
    ],
  },
  {
    title: "Yönetim",
    rows: [
      { label: "Karar destek ve analiz", values: [false, false, "Modül", true] },
      { label: "CRM ve iş zekası (BI)", values: [false, false, false, "Modül"], card: "CRM ve iş zekası" },
    ],
  },
  {
    title: "e-Dönüşüm",
    rows: [
      { label: "e-Fatura, e-Arşiv, e-İrsaliye", values: [true, true, true, true], card: "e-Fatura ve e-Arşiv" },
      // Jump/Bulut'ta e-Defter genel muhasebe, e-Bordro personel modülüne dayanıyor
      { label: "e-Defter, e-Bordro, e-Mutabakat, e-SMM", values: [false, "Modüllerle", "Modüllerle", true] },
    ],
  },
];

export const compareColumn = (id: CompareId) => COMPARE_PRODUCTS.findIndex((p) => p.id === id);
export const findCompareProduct = (id: string) => COMPARE_PRODUCTS.find((p) => p.id === id);
