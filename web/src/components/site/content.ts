// Kamuya açık sitenin metinleri (2026 tasarımı). Ürün bilgileri, karşılaştırma ve e-belge listesi kurumsal/*-data.ts'ten.
//
// Yazım kuralları: düz, bilgilendirici cümleler; "biz" ve "siz". Reklam kalıbı yok ("çözüm ortağınız", "yanınızdayız",
// "tek elden", "uçtan uca", "profesyonel ekip", "Mikro'nun yetmediği yerde"...), ünlem yok, abartı yok.
// Yalnız GoTech'in doğruladığı bilgiler: 2017'den beri Mikro iş ortağı, ekip Mikro Yazılım'da çalıştı, Jumper ve Flyer
// Silver Partner, hafta içi 09.00–18.00, uzak bağlantı (GoTech Desk), destek portalı, İzmir ve çevresinde yerinde destek,
// ücretsiz keşif/demo, lisans ve veriler müşteride kalır, ASELSAN referansı. Süre, rakam ve garanti yazılmaz.

import type { PageLinkData } from "@/components/home/parts";

export type NavLink = { href: string; label: string; note?: string };

export const PORTAL_HREF = "/giris";

export const NAV: (NavLink & { children?: NavLink[] })[] = [
  {
    href: "/urunler",
    label: "Ürünler",
    children: [
      { href: "/urunler/mikro-jump", label: "Mikro Jump", note: "Küçük ve orta ölçekli işletmeler" },
      { href: "/urunler/mikro-jump#basic", label: "Mikro Jump Basic", note: "3 kullanıcıya kadar" },
      { href: "/urunler/mikro-jump#bulut", label: "Mikro Jump Bulut", note: "Sunucu kurmadan, tarayıcıdan" },
      { href: "/urunler/mikro-fly", label: "Mikro Fly", note: "Büyük işletmeler ve grup şirketleri" },
      { href: "/urunler#karsilastirma", label: "Karşılaştırma", note: "Hangi üründe ne var" },
    ],
  },
  {
    href: "/hizmetlerimiz",
    label: "Hizmetler",
    children: [
      { href: "/hizmetlerimiz#analiz", label: "Analiz ve teklif", note: "Ücretsiz keşif görüşmesi" },
      { href: "/hizmetlerimiz#kurulum", label: "Kurulum", note: "Kullanıcılar, yetkiler, ek çözümler" },
      { href: "/hizmetlerimiz#edonusum", label: "e-Dönüşüm", note: "GİB başvurusu ve e-belge ayarları" },
      { href: "/hizmetlerimiz#egitim", label: "Eğitim", note: "Kullanıcı ve yönetici eğitimi" },
      { href: "/hizmetlerimiz#destek", label: "Destek", note: "Uzak bağlantı, portal, yerinde" },
    ],
  },
  { href: "/yazilim-cozumleri", label: "Yazılım" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export const FOOTER_PRODUCTS: NavLink[] = [
  { href: "/urunler/mikro-jump", label: "Mikro Jump" },
  { href: "/urunler/mikro-jump#basic", label: "Mikro Jump Basic" },
  { href: "/urunler/mikro-jump#bulut", label: "Mikro Jump Bulut" },
  { href: "/urunler/mikro-fly", label: "Mikro Fly" },
  { href: "/urunler#karsilastirma", label: "Ürün karşılaştırması" },
];

export const FOOTER_SERVICES: NavLink[] = [
  { href: "/hizmetlerimiz#analiz", label: "Analiz ve teklif" },
  { href: "/hizmetlerimiz#kurulum", label: "Kurulum" },
  { href: "/hizmetlerimiz#edonusum", label: "e-Dönüşüm" },
  { href: "/hizmetlerimiz#egitim", label: "Eğitim" },
  { href: "/hizmetlerimiz#destek", label: "Destek" },
  { href: "/yazilim-cozumleri", label: "Özel yazılım" },
];

// Üst bant: V16'nın destek bitiş tarihi (Notice kalan günü yazar, tarih geçince "sona erdi"ye döner)
export const V16_END = { iso: "2026-10-15", label: "15 Ekim 2026" };

/* ------------------------------------------------------------------ ana sayfa */

export const HOME_HERO = {
  label: "Mikro Yazılım iş ortağı · İzmir",
  // başlık ve metin panelden de değişebilir (Site içeriği > Ana sayfa girişi); boşsa bunlar
  image: { src: "/images/mikro-gorsel/depo-ofis.webp", alt: "Depo ofisinde dizüstü bilgisayara birlikte bakan iki çalışan", width: 1080, height: 607 },
};

export const HOME_INTRO = {
  label: "GoTech",
  text: "Ekibimiz Mikro Yazılım'da çalıştıktan sonra 2017'de GoTech'i kurdu. Bugün Alsancak'taki ofisimizden işletmelere Mikro kuruyor, çalışanlarına programı öğretiyor ve kurulumdan sonraki desteği veriyoruz.",
  link: { label: "Hakkımızda", href: "/hakkimizda" },
};

export const HOME_PRODUCTS = {
  label: "Ürünler",
  title: "Jump mı, Fly mı?",
  soft: "Cümleyi kendi işletmenize göre tamamlayın.",
  lede: "Mikro, ürünlerini çalışan sayısına ve işin kapsamına göre ayırıyor. Aşağıdan size uyan ürünü görebilirsiniz; kesin kararı demo görüşmesinde birlikte veriyoruz.",
};

export type ProcessStep = { title: string; body: string; scope: string[]; image: string; alt: string };

export const HOME_PROCESS = {
  label: "Nasıl çalışıyoruz",
  title: "İlk görüşmeden canlı kullanıma",
  lede: "Bir Mikro kurulumu genelde bu adımlardan geçer. Süreyi ve ayrıntıları keşif görüşmesinde işletmenize göre netleştiriyoruz.",
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Tanışma",
    body: "İşinizi, bugün hangi programları kullandığınızı ve Mikro'yu kaç kişinin kullanacağını konuşuyoruz. İsterseniz programı çalışırken gösteriyoruz.",
    scope: ["Ücretsiz keşif görüşmesi", "Demo"],
    image: "/images/stok/destek-gorusme.webp",
    alt: "Dizüstü bilgisayarla görüntülü görüşme yapan bir kişi",
  },
  {
    title: "Analiz",
    body: "Süreçlerinizi inceliyor, hangi ürünün ve hangi modüllerin gerektiğini birlikte belirliyoruz.",
    scope: ["Süreç analizi", "Ürün ve modül önerisi"],
    image: "/images/stok/analiz-atolye.webp",
    alt: "Beyaz tahta önünde süreçleri konuşan bir ekip",
  },
  {
    title: "Teklif",
    body: "Lisans ya da kiralama bedeli, kurulum, yıllık bakım ve e-Dönüşüm kontörü teklifte ayrı satırlarda yer alır.",
    scope: ["Lisans ya da kiralama", "Kurulum", "Yıllık bakım", "e-Dönüşüm kontörü"],
    image: "/images/stok/rapor-tablet.webp",
    alt: "Masada tablet ve basılı raporlar",
  },
  {
    title: "Kurulum",
    body: "Mikro'yu sunucunuza ya da bilgisayarlarınıza kuruyor, kullanıcıları ve yetkileri tanımlıyoruz. Gerekiyorsa GİB başvurusunu ve e-belge ayarlarını da bu adımda yapıyoruz.",
    scope: ["Yazılım kurulumu", "Kullanıcı ve yetkiler", "e-Dönüşüm ayarları"],
    image: "/images/stok/kurulum-ekip.webp",
    alt: "Dizüstü bilgisayarlarla birlikte çalışan üç kişi",
  },
  {
    title: "Eğitim",
    body: "Kullanıcılarınıza ve yöneticilere programı kendi işleriniz üzerinden öğretiyoruz.",
    scope: ["Kullanıcı eğitimi", "Yönetici eğitimi"],
    image: "/images/stok/egitim-sunum.webp",
    alt: "Toplantı masasında ekibine anlatım yapan bir eğitmen",
  },
  {
    title: "Destek",
    body: "Program çalışmaya başladıktan sonraki destek de bizden: uzak bağlantı, destek portalı ve gerektiğinde yerinde destek.",
    scope: ["Uzak bağlantı", "Destek portalı", "Yerinde destek"],
    image: "/images/mikro-gorsel/edonusum-ofis.webp",
    alt: "Ofiste bilgisayar başında birlikte çalışan iki kişi",
  },
];

export const HOME_EDOCS = {
  label: "e-Dönüşüm",
  title: "e-Belgeler Mikro'nun içinden kesilir",
  body: "Hangi e-belgelerin sizin için zorunlu olduğunu çıkarıyoruz. GİB başvurusunu, entegratör bağlantısını ve Mikro'daki ayarları biz yapıyoruz; belgeleri ayrı bir programa geçmeden, kontörle kesersiniz.",
  link: { label: "Hangi belgeler size zorunlu, birlikte bakalım", href: "#iletisim", konu: "bilgi" } satisfies PageLinkData,
};

// e-belge adı → tek satır açıklama (sıra: urunler-data EDONUSUM_DOCS)
export const EDOC_NOTES: Record<string, string> = {
  "e-Fatura": "Kayıtlı kullanıcılara kesilen fatura",
  "e-Arşiv": "e-Fatura kullanmayan alıcılara fatura",
  "e-İrsaliye": "Sevk irsaliyesinin elektronik hâli",
  "e-Defter": "Yevmiye, büyük defter ve berat",
  "e-Mutabakat": "Cari ve Ba/Bs mutabakatı",
  "e-SMM": "Serbest meslek makbuzu",
  "e-Müstahsil": "Çiftçiden alımlarda makbuz",
  "e-Bordro": "Bordroların elektronik gönderimi",
};

export const HOME_SUPPORT = {
  label: "Destek",
  title: "Kurulumdan sonraki destek",
  body: "Bir sorun olduğunda talebinizi destek portalından açarsınız; kimin üstlendiğini ve hangi aşamada olduğunu oradan görürsünüz. Gerekirse GoTech Desk ile bilgisayarınıza bağlanıyoruz.",
};

export type SupportChannel = {
  id: string;
  title: string;
  body: string;
  // kısa not: kanalın ne zaman/nerede geçerli olduğu
  note: string;
  image: { src: string; alt: string };
};

// Destek kanalları (Support): seçilen kanalın fotoğrafı büyük görünür. Telefon satırı yalnız numara panelden girilince eklenir.
export const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    id: "uzak",
    title: "Uzak bağlantı",
    body: "Kendi uygulamamız GoTech Desk ile bilgisayarınıza bağlanıp sorunu ekranınız üzerinden birlikte inceliyoruz.",
    note: "Çalışma saatlerinde",
    image: { src: "/images/stok/destek-gorusme.webp", alt: "Dizüstü bilgisayarla görüntülü görüşme yapan bir kişi" },
  },
  {
    id: "portal",
    title: "Destek portalı",
    body: "Talebinizi portaldan açarsınız; kimin üstlendiğini ve hangi aşamada olduğunu (açık, işlemde, kapandı) oradan görürsünüz. Yazışmalar talebin içinde kalır.",
    note: "Talep açmak için saat sınırı yok",
    image: { src: "/images/stok/web-cihazlar.webp", alt: "Masada dizüstü bilgisayar, tablet ve telefon" },
  },
  {
    id: "yerinde",
    title: "Yerinde destek",
    body: "Uzaktan çözülemeyen ya da yerinde bakılması gereken işlerde işletmenize geliyoruz.",
    note: "İzmir ve çevresi",
    image: { src: "/images/mikro-gorsel/edonusum-ofis.webp", alt: "Ofiste bilgisayar başında birlikte çalışan iki kişi" },
  },
];

export const PHONE_CHANNEL_IMAGE = { src: "/images/stok/kurulum-ekip.webp", alt: "Dizüstü bilgisayarlarla birlikte çalışan üç kişi" };

export const TAKEOVER = {
  title: "Mikro'yu başka bir iş ortağından aldıysanız",
  // başlıkla tek cümle olarak okunur: "Mikro'yu ... aldıysanız desteğinizi bize taşıyabilirsiniz."
  body: "desteğinizi bize taşıyabilirsiniz. Lisansınız ve verileriniz olduğu gibi kalır; önce mevcut kurulumunuzu inceliyoruz.",
  link: { label: "Kurulumunuzu inceleyelim", href: "#iletisim", konu: "gecis" } satisfies PageLinkData,
};

export const HOME_SOFTWARE = {
  label: "Özel yazılım",
  title: "Mikro'ya bağlı ya da ondan bağımsız, işinize özel yazılım",
  body: "Mikro'yla birlikte çalışan ek ekranlar, raporlar ve bayi sipariş uygulamaları geliştiriyoruz. Kurumsal web sitesi, e-ticaret ve müşteri portalı projelerini de kendi ekibimiz yapıyor.",
  image: { src: "/images/stok/kod-inceleme.webp", alt: "Dizüstü bilgisayarda kodu birlikte inceleyen iki yazılımcı", width: 960, height: 641 },
  link: { label: "Yazılım çözümleri", href: "/yazilim-cozumleri" },
};

export const HOME_FAQ = [
  {
    q: "Hangi Mikro ürünü bize uygun?",
    a: "Programı aynı anda kaç kişinin kullanacağına ve neye ihtiyacınız olduğuna bağlı. 3 kullanıcıya kadar Jump Basic, 5–50 çalışanlı işletmeler için Mikro Jump, 50'den fazla çalışanı olan işletmeler ve grup şirketleri için Mikro Fly. Programa internet olan her yerden erişmek istiyorsanız Jump Bulut var.",
  },
  {
    q: "Kurulum ne kadar sürer?",
    a: "Ürüne ve modül sayısına göre değişiyor. Süreyi keşif görüşmesinden sonra işletmenize göre netleştiriyoruz.",
  },
  {
    q: "Fiyat neye göre belirleniyor?",
    a: "Lisans ya da kiralama bedeli (ana paket, seçtiğiniz modüller ve kullanıcı sayısı), kurulum, yıllık bakım ve e-Dönüşüm kontörü. Hepsini teklifte ayrı satırlarda görürsünüz.",
  },
  {
    q: "e-Fatura ve e-Defter için ayrı bir program gerekir mi?",
    a: "Hayır. Belgeler Mikro'nun içinden kesilir; kontör teklifte ayrı kalemdir. GİB başvurusunu ve entegratör bağlantısını biz yapıyoruz.",
  },
  {
    q: "Kurulumdan sonra desteği kim veriyor?",
    a: "GoTech ekibi. Talebinizi destek portalından açıyor, kimin üstlendiğini ve hangi aşamada olduğunu oradan takip ediyorsunuz. Gerektiğinde uzak bağlantıyla ya da yerinde destek veriyoruz.",
  },
  {
    q: "Mikro'yu başka bir iş ortağından aldık. Desteği size taşıyabilir miyiz?",
    a: "Evet. Lisansınız ve verileriniz olduğu gibi kalır; mevcut kurulumunuzu inceleyip desteği devralıyoruz.",
  },
];

/* ------------------------------------------------------------------ iletişim */

export const CONTACT_DEFAULT = {
  label: "İletişim",
  note: "Formu gönderdiğinizde mesajınız doğrudan ekibimize ulaşır.",
};

export const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\n/g, " "))}`;

/* ------------------------------------------------------------------ ürünler */

export const PRODUCTS_HERO = {
  title: "Mikro Jump ve Mikro Fly",
  lede: "Mikro'nun Jump ve Fly ürünlerinde Silver iş ortağıyız. Jump ailesi küçük ve orta ölçekli işletmeler, Fly büyük işletmeler ve grup şirketleri için. Aşağıda kime göre olduklarını ve hangisinde ne bulunduğunu görebilirsiniz; kesin kararı demo görüşmesinde birlikte veriyoruz.",
};

export type ProductLine = {
  id: "mikro-jump" | "mikro-fly";
  name: string;
  page: string;
  audience: string;
  body: string;
  image: { src: string; alt: string; width: number; height: number };
  versions?: { href: string; name: string; note: string }[];
  points?: string[];
};

// Bilgiler Mikro'nun ürün sayfalarından (kurumsal/urun-detay.ts, karsilastirma.ts)
export const PRODUCT_LINES: ProductLine[] = [
  {
    id: "mikro-jump",
    name: "Mikro Jump",
    page: "/urunler/mikro-jump",
    audience: "Küçük ve orta ölçekli işletmeler",
    body: "Stok, satış, satın alma ve finans ana pakette; genel muhasebe, personel ve üretim modül olarak eklenir. Üç sürümü var:",
    image: { src: "/images/mikro-gorsel/depo-ofis.webp", alt: "Depo ofisinde dizüstü bilgisayara birlikte bakan iki çalışan", width: 1080, height: 607 },
    versions: [
      { href: "/urunler/mikro-jump#basic", name: "Jump Basic", note: "3 kullanıcıya kadar; ön muhasebeden fazlasını isteyenler için" },
      { href: "/urunler/mikro-jump#jump", name: "Mikro Jump", note: "5–50 çalışanlı işletmeler; 20 ek kullanıcıya kadar" },
      { href: "/urunler/mikro-jump#bulut", name: "Jump Bulut", note: "Sunucu kurmadan, internet olan her yerden" },
    ],
  },
  {
    id: "mikro-fly",
    name: "Mikro Fly",
    page: "/urunler/mikro-fly",
    audience: "Büyük işletmeler ve grup şirketleri",
    body: "Genel muhasebe, personel, üretim ve karar destek ana pakette. MRP2, CRM, iş zekası ve gelişmiş insan kaynakları modül olarak eklenir.",
    image: { src: "/images/mikro-gorsel/uretim-hatti.webp", alt: "Tekstil üretim hattında çalışanlar", width: 1080, height: 607 },
    points: [
      "Kullanıcı sınırı yok",
      "MRP2 ile makine, zaman ve iş gücü planlama",
      "Birden çok şirket tek sistemde, konsolide raporlama",
      "UFRS uyumlu finansal raporlama",
    ],
  },
];

export const PRODUCTS_FAQ_QUESTIONS = [
  "Hangi Mikro ürünü bize uygun?",
  "e-Fatura ve e-Defter programın içinde mi?",
  "Aynı anda kaç kişi çalışabilir?",
  "Depomuzla ya da bayilerimizle entegre olur mu?",
  "Fiyat neye göre belirleniyor?",
];

/* ------------------------------------------------------------------ ürün sayfaları (Jump, Fly) */

// Girişin başlığı ve metni: ürün adı logoda yazdığı için başlık ne olduğunu söyler (urun-detay.ts'teki Mikro metinleri yerine düz anlatım)
export const PRODUCT_INTROS: Record<string, { title: string; lede: string; contactTitle: string }> = {
  "mikro-jump": {
    title: "Küçük ve orta ölçekli işletmeler için modüler ERP",
    lede: "Satış, stok ve finans ana pakette; genel muhasebe, personel ve üretim modül olarak eklenir. Bugün gerekenle başlar, işiniz büyüdükçe modül eklersiniz. Basic, Jump ve Bulut sürümlerinden size uyanı birlikte seçiyoruz.",
    contactTitle: "Mikro Jump için bir görüşme planlayalım",
  },
  "mikro-fly": {
    title: "Büyük işletmeler ve grup şirketleri için kurumsal ERP",
    lede: "Üretim planlama, ileri muhasebe, insan kaynakları, CRM ve iş zekası aynı sistemde; kullanıcı sınırı yok. Birden çok şirketi tek merkezden yönetir, konsolide raporlarsınız.",
    contactTitle: "Mikro Fly için bir görüşme planlayalım",
  },
};

export const PRODUCT_CONTACT_LEAD =
  "Kaç kişinin çalışacağını ve süreçlerinizi dinleyip hangi sürüm ve modüllerin gerektiğini birlikte belirleyelim. Keşif görüşmesi ve demo ücretsiz.";

/* ------------------------------------------------------------------ hizmetler */

export const SERVICES_HERO = {
  title: "Analizden kurulum sonrası desteğe",
  lede: "Mikro'yu kurmak işin bir parçası. Doğru ürünü ve modülleri seçmek, e-belgelere geçmek, ekibinizin programı öğrenmesi ve sonrasında çıkan sorular da işin içinde. Aşağıda her birinde ne yaptığımızı anlatıyoruz.",
  image: { src: "/images/mikro-gorsel/ofis-toplanti.webp", alt: "Cam bölmeli toplantı odasında çalışan bir ekip", width: 1080, height: 607 },
};

// hizmet dizini: her satır sayfadaki bölüme iner (menüdeki /hizmetlerimiz#... bağlantıları da)
export const SERVICE_INDEX = [
  { id: "analiz", title: "Analiz ve teklif", text: "Hangi ürünün ve modüllerin gerektiğini birlikte çıkarıyoruz." },
  { id: "kurulum", title: "Kurulum", text: "Programı kuruyor, kullanıcıları ve yetkileri tanımlıyoruz." },
  { id: "edonusum", title: "e-Dönüşüm", text: "GİB başvurusu, entegratör bağlantısı ve e-belge ayarları." },
  { id: "egitim", title: "Eğitim", text: "Kullanıcılara ve yöneticilere, kendi işleriniz üzerinden." },
  { id: "destek", title: "Destek", text: "Uzak bağlantı, destek portalı ve gerektiğinde yerinde destek." },
];

export const SERVICE_ANALYSIS = {
  label: "Analiz ve teklif",
  title: "Hangi Mikro, hangi modüller?",
  body: "İşinizi dinliyor; bugün ne kullandığınızı, kaç kişinin çalışacağını ve süreçlerinizi çıkarıyoruz. Hangi Mikro ürününün ve hangi modüllerin gerektiğini birlikte belirliyor, teklifi kalem kalem hazırlıyoruz.",
  items: ["Ücretsiz keşif görüşmesi ve demo", "Süreç analizi", "Ürün ve modül önerisi", "Lisans ya da kiralama teklifi"],
  image: { src: "/images/stok/analiz-atolye.webp", alt: "Beyaz tahta önünde süreçleri konuşan bir ekip", width: 960, height: 640 },
  link: { label: "Keşif görüşmesi isteyin", href: "#iletisim", konu: "demo" } satisfies PageLinkData,
};

export const SERVICE_SETUP = {
  label: "Kurulum",
  title: "Kurulum ve entegrasyon",
  body: "Mikro'yu sunucunuza ya da bilgisayarlarınıza kuruyor, kullanıcıları ve yetkileri tanımlıyoruz; Jump Bulut'ta sunucu kurulumu gerekmiyor. Depo, bayi ve perakende için ek çözümleri de kurup Mikro'ya bağlıyoruz.",
  extras: [
    { title: "Zeus WMS", text: "Depo yönetimi" },
    { title: "B2B / B4B", text: "Bayi ve saha satış" },
    { title: "Mikro Hızlı Satış", text: "Perakende satış noktası" },
    { title: "Mikro Drive", text: "Bulut yedekleme" },
  ],
  image: { src: "/images/stok/kurulum-ekip.webp", alt: "Dizüstü bilgisayarlarla birlikte çalışan üç kişi", width: 960, height: 640 },
};

export const SERVICE_TRAINING = {
  label: "Eğitim",
  title: "Kullanıcı ve yönetici eğitimi",
  body: "Kurulumdan sonra kullanıcılarınıza ve yöneticilere Mikro'yu anlatıyoruz. Eğitimi kendi kayıtlarınız ve süreçleriniz üzerinden yapıyoruz.",
  items: ["Kullanıcı eğitimi", "Yönetici eğitimi"],
  image: { src: "/images/stok/egitim-sunum.webp", alt: "Toplantı masasında ekibine anlatım yapan bir eğitmen", width: 960, height: 640 },
};

export const SERVICES_FAQ_QUESTIONS = [
  "Kurulum ne kadar sürer?",
  "Fiyat neye göre belirleniyor?",
  "e-Fatura ve e-Defter için ayrı bir program gerekir mi?",
  "Kurulumdan sonra desteği kim veriyor?",
  "Mikro'yu başka bir iş ortağından aldık. Desteği size taşıyabilir miyiz?",
];

/* ------------------------------------------------------------------ yazılım */

export const SOFTWARE_HERO = {
  title: "İşinize özel yazılım",
  soft: "Mikro'ya bağlı ya da bağımsız.",
  lede: "Mikro'yla birlikte çalışan ek ekranlar, raporlar, bayi sipariş ve saha satış uygulamaları geliştiriyoruz. Kurumsal web sitesi, e-ticaret ve portal projelerini de kendi ekibimiz yapıyor.",
  image: { src: "/images/stok/yazilimci.webp", alt: "Pencere kenarındaki masada iki ekranla kod yazan bir yazılımcı", width: 960, height: 641 },
};

// Her projenin başında birlikte karar verilen konular: söz değil, konuşulan sorular (eski APPROACH iddiaları doğrulanmadı)
export const SOFTWARE_TOPICS = {
  label: "Her projede",
  title: "İşin başında birlikte karar verdiklerimiz",
  items: [
    { title: "Veriler nerede tutulacak?", body: "Mikro'ya bağlı işlerde verinin Mikro'da mı kalacağına, ayrı bir yerde mi tutulacağına işin başında birlikte karar veriyoruz." },
    { title: "Hangi cihazlardan kullanılacak?", body: "Uygulamanın yalnız bilgisayardan mı, telefon ve tabletten de mi kullanılacağını baştan konuşuyoruz." },
    { title: "Kim neyi görecek?", body: "Kullanıcıların neyi görüp neyi değiştirebileceğini birlikte belirliyoruz." },
    { title: "Nerede çalışacak?", body: "Uygulamanın hangi sunucuda çalışacağını görüşmede konuşuyoruz." },
  ],
};

export const SOFTWARE_CONTACT = {
  title: "Projenizi konuşalım",
  lead: "Ne yapmak istediğinizi ve bugün hangi programları kullandığınızı kısaca yazın. İlk görüşmede kapsamı birlikte çıkaralım; görüşme ücretsiz.",
};

/* ------------------------------------------------------------------ hakkımızda */

export const ABOUT_HERO = {
  title: "Mikro Yazılım'da başladık, 2017'den beri iş ortağıyız.",
  lede: "Ekibimiz Mikro Yazılım'da çalıştıktan sonra 2017'de GoTech'i kurdu. Alsancak'taki ofisimizden işletmelere Mikro kuruyor, eğitimini ve desteğini veriyoruz; ihtiyaç duyulan ek yazılımları da kendimiz geliştiriyoruz.",
};

export const ABOUT_STORY = {
  label: "Biz kimiz",
  title: "Mikro Yazılım'da çalışmış bir ekip",
  paragraphs: [
    "Mikro Yazılım'da çalıştık; programı ve işletmelerin günlük kullanımda neye ihtiyaç duyduğunu orada gördük. 2017'den beri işletmelerin Mikro'ya geçişini, kurulumunu, eğitimini ve günlük desteğini yürütüyoruz.",
    "KOBİ'lere ve kurumlara iş analizi, kurulum, eğitim ve destek veriyor; Mikro'yla entegre çalışan yazılımları kurup bağlıyoruz. Mikro'nun Jumper ve Flyer iş ortaklığı programlarında Silver seviyesindeyiz.",
  ],
  image: { src: "/images/stok/izmir-kordon.webp", alt: "İzmir Kordon'da deniz kenarındaki tarihî sarı bina ve yürüyen insanlar", width: 1024, height: 768, caption: "Kordon, İzmir" },
};

export const ABOUT_INDEX = [
  { href: "/urunler", title: "Ürünler", text: "Mikro Jump ailesi ve Mikro Fly: kimin için, hangisinde ne var." },
  { href: "/hizmetlerimiz", title: "Hizmetler", text: "Analiz, kurulum, e-Dönüşüm, eğitim ve destek." },
  { href: "/yazilim-cozumleri", title: "Yazılım", text: "Mikro'ya entegre ekranlar ve raporlar; web, e-ticaret ve portal projeleri." },
];
