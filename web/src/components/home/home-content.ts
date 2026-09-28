// Ana sayfaya özel sabit metinler. Panelden düzenlenenler (giriş, rakamlar, iletişim, alt bilgi)
// kurumsal/content.ts + getSiteConfig'ten; ürün ve hizmetler kurumsal/urunler-data.ts'ten geliyor.
// Metinlerde yalnız GoTech'in onayladığı bilgiler ve Mikro'nun ürün sayfalarındaki bilgiler var: süre, müşteri sayısı ya da
// "7/24" gibi doğrulanmamış iddia yazılmaz.
import type { PageLinkData } from "./parts";

// Üst menü: ana sayfada da iç sayfalarda da aynı (HomeNav). children: masaüstünde açılır alt menü, telefonda girintili liste
export type NavLink = { href: string; label: string; note?: string };
export const SITE_NAV: (NavLink & { children?: NavLink[] })[] = [
  {
    href: "/urunler",
    label: "Ürünler",
    children: [
      { href: "/urunler/mikro-jump#basic", label: "Mikro Jump Basic", note: "3 kullanıcıya kadar ara ERP" },
      { href: "/urunler/mikro-jump", label: "Mikro Jump", note: "KOBİ'ler için modüler ERP" },
      { href: "/urunler/mikro-jump#bulut", label: "Mikro Jump Bulut", note: "Sunucusuz, tarayıcıdan" },
      { href: "/urunler/mikro-fly", label: "Mikro Fly", note: "Büyük işletmeler ve grup şirketleri" },
      { href: "/urunler", label: "Ürün karşılaştırması", note: "Hangisinde ne var, ne yok?" },
    ],
  },
  {
    href: "/hizmetlerimiz",
    label: "Hizmetler",
    children: [
      { href: "/hizmetlerimiz#analiz", label: "Analiz ve teklif", note: "Ücretsiz keşif görüşmesi" },
      { href: "/hizmetlerimiz#kurulum", label: "Kurulum ve entegrasyon", note: "Kurulum, yetkiler, ek çözümler" },
      { href: "/hizmetlerimiz#edonusum", label: "e-Dönüşüm", note: "GİB başvurusu ve e-belge ayarları" },
      { href: "/hizmetlerimiz#egitim", label: "Eğitim", note: "Kullanıcı ve yönetici eğitimi" },
      { href: "/hizmetlerimiz#destek", label: "Teknik destek", note: "Uzak bağlantı, portal, yerinde" },
    ],
  },
  { href: "/yazilim-cozumleri", label: "Yazılım" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

// Ana sayfanın bölümleri: alt bilgideki "Bu sayfada" sütunu
export const HOME_ANCHORS = [
  { href: "#urunler", label: "Mikro ürünleri" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#moduller", label: "Modüller ve sektörler" },
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

// Giriş (Hero.tsx): başlık, açıklama ve buton yazısı panelden; rozet, güven maddeleri ve fotoğraf burada.
// Fotoğraf Mikro'nun sitesinden (public/images/mikro-gorsel/KAYNAK.md).
export const HERO = {
  badge: "Mikro Yazılım Yetkili İş Ortağı · İzmir",
  checks: ["Ücretsiz keşif ve demo", "İzmir'de yerinde destek", "Kurulum, eğitim, e-Dönüşüm", "Kendi yazılım ekibimiz"],
  image: "/images/mikro-gorsel/edonusum-ofis.webp",
  alt: "Ofiste bilgisayar başında birlikte çalışan iki kişi",
};

// Girişin altındaki rakam kartları: panelde girilmemiş rakamların yerini bunlar doldurur. Hepsi doğrulanmış bilgiden:
// kuruluş yılı, iki Silver rozeti, satılan dört Mikro ürünü (urunler-data PRODUCTS), kurulan sekiz e-belge (EDONUSUM_DOCS).
export const HERO_FACTS: { value: string; label: string }[] = [
  { value: "2017", label: "yılından beri Mikro Yazılım yetkili iş ortağı" },
  { value: "2× Silver", label: "Jumper ve Flyer iş ortaklığı programlarında" },
  { value: "4 ürün", label: "Jump Basic, Jump, Jump Bulut ve Fly" },
  { value: "8 e-belge", label: "e-Fatura'dan e-Bordro'ya e-Dönüşüm kurulumu" },
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

// Ana sayfa Hizmetler bölümü: numaralı altı hizmet, iki sütun liste. Ayrıntısı /hizmetlerimiz'de;
// e-Dönüşüm ve Destek kartları ana sayfadaki kendi bölümlerine iner.
export type ServiceCard = { id: string; title: string; body: string; link: PageLinkData };

export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: "analiz",
    title: "Analiz ve teklif",
    body: "İşinizi dinliyor; bugün ne kullandığınızı, kaç kişinin çalışacağını ve süreçlerinizi çıkarıyoruz. Hangi Mikro ürününün ve modüllerin gerektiğini birlikte belirleyip teklifi kalem kalem hazırlıyoruz.",
    link: { label: "Keşif görüşmesi isteyin", href: "#iletisim", konu: "demo" },
  },
  {
    id: "kurulum",
    title: "Kurulum ve entegrasyon",
    body: "Mikro'yu sunucunuza ya da bilgisayarlarınıza kuruyor, kullanıcıları ve yetkileri tanımlıyoruz. Zeus WMS, B2B/B4B gibi ek çözümleri de kurup Mikro'ya bağlıyoruz.",
    link: { label: "Kurulum adımları", href: "/hizmetlerimiz#kurulum" },
  },
  {
    id: "edonusum-hizmet",
    title: "e-Dönüşüm",
    body: "Hangi e-belgelerin sizin için zorunlu olduğunu çıkarıyor; GİB başvurusunu, entegratör bağlantısını ve Mikro'daki e-belge ayarlarını yapıyoruz.",
    link: { label: "e-Belgeler", href: "#edonusum" },
  },
  {
    id: "egitim",
    title: "Eğitim",
    body: "Kurulumdan sonra kullanıcılarınıza ve yöneticilere programı kendi işleriniz üzerinden öğretiyoruz: kullanıcı eğitimi ve yönetici eğitimi.",
    link: { label: "Eğitim hakkında", href: "/hizmetlerimiz#egitim" },
  },
  {
    id: "destek-hizmet",
    title: "Teknik destek",
    body: "Kurulumdan sonraki desteği de biz veriyoruz. Talebinizi destek portalından açar, hangi aşamada olduğunu ve kimin ilgilendiğini oradan takip edersiniz.",
    link: { label: "Destek kanalları", href: "#destek" },
  },
  {
    id: "yazilim-hizmet",
    title: "Özel yazılım",
    body: "Mikro'ya bağlı ek ekran ve raporların yanında web sitesi, müşteri ve bayi portalı, e-ticaret projelerini kendi ekibimizle geliştiriyoruz.",
    link: { label: "Yazılım çözümleri", href: "/yazilim-cozumleri" },
  },
];

// Ana sayfa "Neden GoTech": dört kısa gerekçe, hepsi hakkımızdaki doğrulanmış cümlelerden
export const WHY_GOTECH: { title: string; body: string; link?: PageLinkData }[] = [
  {
    title: "Mikro deneyimi",
    body: "Ekibimiz uzun yıllar Mikro Yazılım'da çalıştı. Programı ve işletmelerin günlük kullanımda nelere ihtiyaç duyduğunu oradan biliyoruz.",
  },
  {
    title: "Tek muhatap",
    body: "Lisans, kurulum, e-Dönüşüm, eğitim ve destek için tek muhatabınız GoTech. Mikro'ya bağlı ek geliştirmeleri de kendi yazılım ekibimiz yapıyor.",
  },
  {
    title: "Kayıtlı destek",
    body: "Talepleriniz destek portalında kayıt altına alınır; hangi aşamada olduğunu ve kimin ilgilendiğini oradan takip edersiniz.",
  },
  {
    title: "Mevcut kurulumunuzu devralıyoruz",
    body: "Mikro'yu başka bir iş ortağından aldıysanız desteğinizi bize taşıyabilirsiniz. Lisansınız ve verileriniz olduğu gibi kalır.",
    link: { href: "#iletisim", label: "Kurulumunuzu inceleyelim", konu: "gecis" },
  },
];

// Ana sayfa "Modüller ve sektörler" (lacivert bölüm): Mikro Jump ve Fly'da ana pakette gelen ve modül olarak eklenen başlıca
// alanlar; altında Mikro'nun sektörel modülleri ve ek çözümleri. Hepsi Mikro'nun ürün sayfalarından (kurumsal/urun-detay.ts).
export const MIKRO_MODULES: { title: string; body: string }[] = [
  { title: "Stok ve depo", body: "Şube ve depolarda renk, beden ve parti-lot bazında stok takibi." },
  { title: "Satış ve satın alma", body: "Müşteri ve tedarikçi yönetimi, sipariş, irsaliye ve fatura." },
  { title: "Finans ve bütçe", body: "Kasa, banka, çek-senet ve kredi süreçleri; bütçe yönetimi." },
  { title: "Genel muhasebe", body: "Genel muhasebe kayıtları, sabit kıymet ve amortisman takibi." },
  { title: "Personel ve bordro", body: "Puantaj, izin takibi, bordro ve özlük işlemleri." },
  { title: "Üretim", body: "Temel üretim ve fason; Fly'da MRP2 ile makine ve iş gücü planlama." },
  { title: "e-Dönüşüm", body: "e-Fatura, e-Arşiv, e-İrsaliye, e-Defter ve e-Bordro programın içinden." },
  { title: "Dış ticaret", body: "İthalat ve ihracat süreçleri; Jump'ta modül, Fly'da ana pakette." },
];

export const SECTORS = [
  "Perakende ve mağaza", "Restoran", "Bayi ve saha satış", "Üretim ve fason", "Depo yönetimi",
  "Tamir ve teknik servis", "Kiralama", "Akaryakıt", "Gayrimenkul", "Dış ticaret",
];

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
export const SUPPORT_CHANNELS: { title: string; when: string; body: string }[] = [
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
  {
    q: "Mikro'yu başka bir iş ortağından aldık, desteği size taşıyabilir miyiz?",
    a: "Evet. Lisansınız ve verileriniz olduğu gibi kalır; mevcut kurulumunuzu inceleyip desteği devralıyoruz.",
  },
];
