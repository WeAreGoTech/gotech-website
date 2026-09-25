// Ana sayfaya özel sabit metinler. Panelden düzenlenenler (hero, rakamlar, iletişim, alt bilgi)
// kurumsal/content.ts + getSiteConfig'ten; ürün ve hizmetler kurumsal/urunler-data.ts'ten geliyor.
import { EDONUSUM_DOCS } from "@/components/kurumsal/urunler-data";
import type { PageLinkData } from "./parts";

// Üst menü: ana sayfada da iç sayfalarda da aynı (HomeNav)
export const SITE_NAV = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/hizmetlerimiz", label: "Hizmetler" },
  { href: "/yazilim-cozumleri", label: "Yazılım" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

// Ana sayfanın bölümleri: alt bilgideki "Bu sayfada" sütunu
export const HOME_ANCHORS = [
  { href: "#urunler", label: "Ürün bulucu" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#edonusum", label: "e-Dönüşüm" },
  { href: "#destek", label: "Destek" },
  { href: "#yazilim", label: "Yazılım" },
  { href: "#sss", label: "SSS" },
];

// Alt bilgideki ürün bağlantıları (Jump'ın Basic ve Bulut sürümleri Jump sayfasındaki kartlarına iner)
export const PRODUCT_LINKS = [
  { href: "/urunler/mikro-jump#basic", label: "Mikro Jump Basic" },
  { href: "/urunler/mikro-jump", label: "Mikro Jump" },
  { href: "/urunler/mikro-jump#bulut", label: "Mikro Jump Bulut" },
  { href: "/urunler/mikro-fly", label: "Mikro Fly" },
  { href: "/hizmetlerimiz#edonusum", label: "e-Dönüşüm" },
];

export const PORTAL_HREF = "/giris";

// Hero slider'ı (HeroSlider): mikro.com.tr ve Logo Yazılım'daki kalıp. Her slaytta başlık, metin, buton ve görsel birlikte
// değişir; altta slaytların adıyla sekme çubuğu. İlk slayt (GoTech) başlığını ve metnini panelden alır (Hero.tsx), diğerleri burada.
// Görseller Mikro'nun sitesinden (public/images/mikro-gorsel/KAYNAK.md) ve CC0 stoktan (public/images/stok/KAYNAK.md).
// Metinlerde yalnız GoTech'in onayladığı iddialar ve Mikro'nun ürün sayfalarındaki bilgiler var.
export type HeroSlide = {
  key: string;
  // sekme çubuğunda görünen kısa ad
  label: string;
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  alt: string;
  cta: PageLinkData;
  more?: PageLinkData;
};

export const HERO_IMAGE = { width: 1080, height: 607 };

// ilk slayt: GoTech'in kendisi. Başlık, metin ve buton yazısı panelden gelir (Site içeriği > Ana sayfa girişi), gerisi burada
export const HERO_INTRO = {
  key: "gotech",
  label: "Kurulum ve destek",
  eyebrow: "Mikro Yazılım Yetkili İş Ortağı · İzmir",
  image: "/images/mikro-gorsel/edonusum-ofis.webp",
  alt: "Ofiste bilgisayar başında birlikte çalışan iki kişi",
  more: { label: "Size uygun ürünü bulun", href: "#urunler" },
} satisfies Partial<HeroSlide>;

export const HERO_SLIDES: HeroSlide[] = [
  {
    key: "jump",
    label: "Mikro Jump",
    eyebrow: "Mikro Jump · Jump Basic · Jump Bulut",
    title: "Büyüyen işletmeler için Mikro Jump",
    lede: "Stok, satış, satın alma ve finans tek programda; genel muhasebe, personel ve üretim modül olarak eklenir. İnternet olan her yerden çalışmak için Jump Bulut var.",
    image: "/images/mikro-gorsel/depo-ofis.webp",
    alt: "Depo ofisinde dizüstü bilgisayara birlikte bakan iki çalışan",
    cta: { label: "Mikro Jump'ı inceleyin", href: "/urunler/mikro-jump" },
    more: { label: "Sürümleri karşılaştırın", href: "/urunler" },
  },
  {
    key: "fly",
    label: "Mikro Fly",
    eyebrow: "Mikro Fly",
    title: "Büyük işletmeler ve grup şirketleri için Mikro Fly",
    lede: "Genel muhasebe, personel, üretim ve karar destek ana pakette. Sınırsız kullanıcı; birden çok şirket tek sistemde.",
    image: "/images/mikro-gorsel/ofis-toplanti.webp",
    alt: "Cam bölmeli toplantı odasında çalışan bir ekip",
    cta: { label: "Mikro Fly'ı inceleyin", href: "/urunler/mikro-fly" },
    more: { label: "Jump ile farkı", href: "/urunler/mikro-fly#fark" },
  },
  {
    key: "edonusum",
    label: "e-Dönüşüm",
    eyebrow: "e-Dönüşüm",
    title: "e-Fatura'dan e-Defter'e, e-Dönüşüm tek elden",
    lede: "Hangi belgelerin sizin için zorunlu olduğunu çıkarıyor; GİB başvurusunu, entegratör bağlantısını ve Mikro'daki e-belge ayarlarını biz yapıyoruz.",
    image: "/images/mikro-gorsel/bulut-rapor.webp",
    alt: "Dizüstü bilgisayarda rapor ekranına bakan bir çalışan",
    cta: { label: "e-Dönüşüm hizmeti", href: "#edonusum" },
    more: { label: "Bilgi isteyin", href: "#iletisim", konu: "bilgi" },
  },
  {
    key: "yazilim",
    label: "Özel yazılım",
    eyebrow: "Özel yazılım",
    title: "Mikro'nun yetmediği yerde kendi yazılım ekibimiz var",
    lede: "Mikro'ya bağlı ekran ve raporlar, web siteleri, müşteri ve bayi portalları geliştiriyoruz.",
    image: "/images/stok/yazilimci.webp",
    alt: "Pencere kenarındaki masada iki ekranla kod yazan bir yazılımcı",
    cta: { label: "Yazılım çözümleri", href: "/yazilim-cozumleri" },
  },
];

// Üst bant: V16'nın destek bitiş tarihi. Bant kalan günü yazar, tarih geçince "sona erdi"ye döner.
export const V16_END = { iso: "2026-10-15", label: "15 Ekim 2026" };

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

// Ana sayfa Hizmetler bölümü (ServiceExplorer): solda hizmet listesi, seçilen açılır; sağda o hizmetin fotoğrafı (SAP ve Siemens
// ana sayfalarındaki kalıp). id'ler sayfa içi bağlantı: #edonusum ve #destek o hizmeti açar. Destek sekmesi çalışma saatlerini ve
// telefonu panelden alır (Services, ServiceSections.tsx). Fotoğraflar CC0 (public/images/stok/KAYNAK.md).
export type ServiceTab = {
  id: string;
  label: string;
  body: string;
  items: string[];
  image: string;
  link?: PageLinkData;
};

export const SERVICE_TABS: ServiceTab[] = [
  {
    id: "analiz",
    label: "Analiz ve teklif",
    body: "İşinizi dinliyor; bugün ne kullandığınızı, kaç kişinin çalışacağını ve süreçlerinizi çıkarıyoruz. Hangi Mikro ürününün ve hangi modüllerin gerektiğini birlikte belirliyor, teklifi kalem kalem hazırlıyoruz.",
    items: ["Ücretsiz keşif görüşmesi", "Süreç analizi", "Ürün ve modül önerisi", "Lisans ya da kiralama teklifi"],
    image: "/images/stok/analiz-atolye.webp",
    link: { label: "Keşif görüşmesi isteyin", href: "#iletisim", konu: "demo" },
  },
  {
    id: "kurulum",
    label: "Kurulum ve entegrasyon",
    body: "Mikro'yu sunucunuza ya da bilgisayarlarınıza kuruyor, kullanıcıları ve yetkileri tanımlıyoruz; Jump Bulut'ta sunucu kurulumu gerekmiyor. Zeus WMS, B2B/B4B gibi ek çözümleri de kurup Mikro'ya bağlıyoruz.",
    items: ["Yazılım kurulumu", "Kullanıcı ve yetki tanımları", "Ek çözümlerin entegrasyonu"],
    image: "/images/stok/kurulum-ekip.webp",
    link: { label: "Ürünleri karşılaştırın", href: "/urunler" },
  },
  {
    id: "edonusum",
    label: "e-Dönüşüm",
    body: "Hangi e-belgelerin sizin için zorunlu olduğunu çıkarıyor; GİB başvurusunu, entegratör bağlantısını ve Mikro'daki e-belge ayarlarını yapıyoruz. Belgeler programın içinden, kontörle kesilir.",
    items: EDONUSUM_DOCS,
    image: "/images/stok/edonusum-evrak.webp",
    link: { label: "Hangi e-belgeler size zorunlu? Birlikte bakalım", href: "#iletisim", konu: "bilgi" },
  },
  {
    id: "egitim",
    label: "Eğitim",
    body: "Kurulumdan sonra kullanıcılarınıza ve yöneticilere programı kendi işleriniz üzerinden öğretiyoruz.",
    items: ["Kullanıcı eğitimi", "Yönetici eğitimi"],
    image: "/images/stok/egitim-sunum.webp",
  },
];

// Destek sekmesi: çalışma saatleri ve telefon panelden (Site ayarları)
export function supportTab(workingHours: string, phone: string): ServiceTab {
  return {
    id: "destek",
    label: "Destek",
    body: `Kurulumdan sonra destek de bizden: ${workingHours.toLocaleLowerCase("tr")}. Talebinizi portaldan açar, kimin üstlendiğini ve hangi aşamada olduğunu oradan görürsünüz.`,
    items: [
      ...(phone ? [`Destek hattı: ${phone}`] : []),
      "Uzak bağlantı: GoTech Desk",
      "Destek portalı: talep açmak için saat sınırı yok",
      "Yerinde destek: İzmir ve çevresi",
    ],
    image: "/images/stok/destek-gorusme.webp",
    link: { label: "Destek portalına giriş", href: PORTAL_HREF },
  };
}

// Hizmetler: ana sayfadaki yol haritasının (PROCESS_STEPS) her adımında o adımda yaptığımız iş (SERVICES kapsamı)
export const JOURNEY_SCOPE: string[][] = [
  ["Ücretsiz keşif görüşmesi", "Formla ya da e-postayla"],
  ["Mevcut süreç analizi", "İhtiyaç tespiti", "Ürün ve modül önerisi"],
  ["Lisans ya da kiralama", "Kurulum", "Yıllık bakım", "e-Dönüşüm kontörü"],
  ["Yazılım kurulumu", "Entegrasyon", "GİB başvurusu ve e-belge ayarları"],
  ["Kullanıcı eğitimi", "Yönetici eğitimi"],
  ["Uzak bağlantı", "Destek portalı", "Yerinde destek"],
];

// Destek kanalları; telefon satırı yalnız numara panelden girilince (Support). when boşsa çalışma saatleri (panelden) yazılır
export const SUPPORT_CHANNELS = [
  { title: "Uzak bağlantı", when: "", body: "Kendi uygulamamız GoTech Desk ile bilgisayarınıza bağlanıp sorunu ekranınızda çözüyoruz." },
  { title: "Destek portalı", when: "Talep açmak için saat sınırı yok", body: "Talebinizi açın; kimin üstlendiğini ve hangi aşamada olduğunu görün." },
  { title: "Yerinde destek", when: "Gerektiğinde", body: "İzmir ve çevresinde işletmenize geliyoruz." },
];

export const HOME_FAQ = [
  {
    q: "Kurulum ne kadar sürer?",
    a: "Ürüne, modül sayısına ve veri miktarına göre değişiyor; süreyi keşif görüşmesinde işletmenize göre netleştiriyoruz.",
  },
  {
    q: "Fiyat neye göre belirleniyor?",
    a: "Lisans ya da kiralama bedeli (ana paket, seçtiğiniz modüller ve kullanıcı sayısı), kurulum, yıllık bakım ve e-dönüşüm kontörü. Hepsini teklifte ayrı satırlarda görürsünüz.",
  },
  {
    q: "Kurulumdan sonra desteği kim veriyor?",
    a: "GoTech ekibi. Destek portalından talep açıyorsunuz; talebinizi kimin üstlendiğini ve hangi aşamada olduğunu oradan takip ediyorsunuz.",
  },
];
