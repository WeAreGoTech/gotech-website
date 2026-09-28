// GoTech'in sattığı Mikro ürünlerinin sayfaları (/urunler/[slug]): Mikro Jump (Basic ve Bulut sürümleriyle) ve Mikro Fly.
// Bilgiler Mikro Yazılım'ın resmi ürün sayfalarından (mikro.com.tr/mikro-jump, /mikro-jump-basic, /mikro-jump-bulut,
// /mikro-fly) özetlendi, Eylül 2026. Görseller ve logolar Mikro'nun kendi sitesinden, iş ortağı olarak (public/images/mikro-gorsel/KAYNAK.md).

import type { CompareId } from "./karsilastirma";

export type Titled = { title: string; body: string };
export type Photo = { src: string; alt: string };
// sürüm kartı; id sayfadaki çapa (/urunler/mikro-jump#basic)
export type Version = Titled & { id: string; points: string[]; highlight?: string };

export type ProductDetail = {
  slug: string;
  // "bir bakışta" bölümündeki artılar/eksikler ve tabloda öne çıkan sütun (karsilastirma.ts)
  compareId: CompareId;
  name: string;
  logo: { src: string; height: number };
  // girişin başlığı: ürün adı logoda yazdığı için burada ne olduğu söylenir
  headline: string;
  audience: string;
  lead: string;
  metaDescription: string;
  photo: Photo;
  intro: { title: string; body: string };
  features: Titled[];
  forWhom: Titled[];
  // ana pakette gelenler ve sonradan modül olarak eklenenler (Mikro'nun ürün sayfasındaki ayrımla)
  packageItems: string[];
  moduleItems: string[];
  // e-belgeler ana paketten ayrı: programın içinden kesilir, kontörle (Mikro'nun sayfalarındaki ayrı "e-Dönüşüm" bölümü)
  edonusumItems: string[];
  // girişin altındaki özellik şeridi (dört kutu)
  highlights: { value: string; label: string }[];
  // GoTech'in bu ürün için Mikro'dan aldığı iş ortaklığı rozeti (public/images)
  badge: { src: string; width: number; height: number; name: string };
  versions?: { title: string; lead: string; items: Version[]; when?: { title: string; items: string[] } };
  // Fly: Jump'tan geçince değişenler (karşılaştırma tablosunun farklı satırları) gösterilsin mi
  diffFrom?: CompareId;
  addons: Titled[];
  faq: { q: string; a: string }[];
};

const SETUP_FAQ = {
  q: "Kurulum ve eğitimi kim yapıyor?",
  a: "İhtiyaç analizini, kurulumu, e-Dönüşüm geçişini ve kullanıcı eğitimini GoTech ekibi yapıyor; sonrasında destek de bizden.",
};

const JUMP: ProductDetail = {
  slug: "mikro-jump",
  compareId: "mikro-jump",
  name: "Mikro Jump",
  logo: { src: "/images/mikro/jump.png", height: 40 },
  headline: "Stoktan bordroya işlerinizi tek programda yönetin",
  audience: "Büyüyen KOBİ'ler ve orta ölçekli işletmeler",
  lead: "Satış, stok, finans, genel muhasebe, personel ve üretimi tek sistemde yönetin. Basic, Jump ve Bulut sürümlerinden işletmenize uyanla başlayın.",
  metaDescription:
    "Mikro Jump, Jump Basic ve Jump Bulut: KOBİ'ler için modüler ERP. Stok, satış, finans, genel muhasebe, personel, üretim ve e-Dönüşüm. Kurulum, eğitim ve destek GoTech'ten.",
  photo: { src: "/images/mikro-gorsel/bulut-rapor.webp", alt: "Dizüstü bilgisayarda satış raporları ve grafikler" },
  intro: {
    title: "Bugün gerekenle başlayın, büyüdükçe modül ekleyin",
    body: "Mikro Jump modüler bir ERP: ihtiyacınız olan modüllerle başlar, işiniz büyüdükçe yenisini eklersiniz. Satış, stok, cari ve finansın yanında genel muhasebe, personel ve üretim de aynı sistemde çalışır. Kurulumu, e-Dönüşüm geçişini ve ekibinizin eğitimini biz yapıyoruz.",
  },
  features: [
    { title: "Genel muhasebe ve sabit kıymet", body: "Ön muhasebenin ötesinde: genel muhasebe kayıtları, sabit kıymet ve amortisman takibi mevzuata uygun şekilde, modül olarak." },
    { title: "Personel yönetimi", body: "Puantaj, izin takibi, bordro ve özlük işlemleri ayrı bir programa gerek kalmadan, modül olarak ERP'nin içinde." },
    { title: "Temel üretim ve fason", body: "Üretim, stok, maliyet ve muhasebe tek ekranda. Fasonla çalışanlar için sevkiyat, stok ve üretim planlama." },
    { title: "Kapsamlı e-Dönüşüm", body: "e-Fatura, e-Arşiv, e-İrsaliye ve e-Müstahsil'in yanında e-Defter, e-İhracat ve e-Bordro. Ayrı yazılım ya da entegrasyon gerekmez." },
    { title: "Detaylı stok ve finans", body: "Tüm şube ve depolarda renk, beden ve parti-lot bazında stok; banka, çek-senet ve kredi süreçleri anlık raporlarla." },
    { title: "Perakende ve entegrasyon", body: "Hızlı satış programlarıyla mağaza, kasa ve promosyon yönetimi. API altyapısıyla kullandığınız sistemler Jump'a bağlanır." },
  ],
  forWhom: [
    { title: "5–50 çalışanlı KOBİ'ler", body: "Kontrollü büyüyen, ihtiyacından fazla fonksiyona para vermek istemeyen işletmeler." },
    { title: "Birden fazla şubesi ya da deposu olanlar", body: "Tüm şube ve depolardaki stok ve finans tek sistemde." },
    { title: "Uzaktan ya da sahada çalışan ekipler", body: "Jump Bulut ile internet olan her yerden, sunucu yatırımı yapmadan." },
    { title: "Perakende, restoran ve servis işletmeleri", body: "Hızlı satış, restoran, tamir-teknik servis ve kiralama çözümleriyle entegre çalışır." },
  ],
  packageItems: [
    "Stok ve ürün yönetimi",
    "Satın alma ve tedarikçi yönetimi",
    "Satış ve müşteri yönetimi",
    "Masraf yönetimi",
    "Finans yönetimi",
    "Bütçe yönetimi",
    "Express Aktarım: fatura ve banka hareketleri mali müşavire dijital",
  ],
  moduleItems: [
    "Genel ve sabit kıymetler muhasebesi",
    "Personel ve bordro",
    "Temel üretim ve fason",
    "Dış ticaret (ithalat, ihracat)",
    "Tamir ve teknik servis",
    "Kiralanabilir varlık (ör. iş makinesi kiralama)",
    "Sektörel: gayrimenkul, perakende, akaryakıt, dayanıklı tüketim",
  ],
  edonusumItems: [
    "e-Fatura, e-Arşiv, e-İrsaliye, e-Müstahsil",
    "e-Defter (genel muhasebe modülüyle)",
    "e-Bordro (personel modülüyle)",
    "e-Mutabakat, e-Z raporu, e-SMM, e-İhracat",
  ],
  highlights: [
    { value: "3 sürüm", label: "Basic, Jump ve Bulut" },
    { value: "20 ek", label: "eş zamanlı kullanıcı" },
    { value: "Modüler", label: "genel muhasebe, personel ve üretim modülleri" },
    { value: "e-Belge", label: "e-Fatura'dan e-Defter'e, programın içinden" },
  ],
  badge: { src: "/images/jumper-silver.png", width: 297, height: 233, name: "Jumper Silver Partner" },
  versions: {
    title: "Üç sürüm, aynı Jump ailesi",
    lead: "Ön muhasebeden fazlasını isteyenler Basic ile, genel muhasebe ve üretim de gerekenler Jump ile başlar; sunucu kurmak istemeyenler Jump'ı bulutta kullanır. Hangisinin size uyduğunu ücretsiz ön görüşmede birlikte belirliyoruz.",
    items: [
      {
        id: "basic",
        title: "Mikro Jump Basic",
        body: "Ön muhasebeden fazlasını isteyen, büyümeye başlayan işletmeler için ara ERP.",
        points: [
          "3 kullanıcıya kadar eş zamanlı çalışma",
          "Seri no, parti-lot, renk/beden stok takibi",
          "e-Fatura, e-Arşiv, e-İrsaliye, e-Müstahsil",
          "Kiralama modeliyle ilk yatırım maliyeti yok",
        ],
      },
      {
        id: "jump",
        title: "Mikro Jump",
        body: "Orta ölçekli KOBİ'nin kapsamlı, modüler ERP'si.",
        points: [
          "20 ek kullanıcıya kadar eş zamanlı çalışma",
          "Genel muhasebe, personel ve temel üretim modülleri",
          "e-Defter, e-Bordro ve e-İhracat dahil bütün e-belgeler",
          "Kendi sisteminizde, SQL Server 2016 ve üzeri",
        ],
      },
      {
        id: "bulut",
        title: "Mikro Jump Bulut",
        body: "Mikro Jump'ın internet olan her yerden, tarayıcıdan çalışan sürümü.",
        points: [
          "Sunucu, kurulum ve donanım yatırımı gerekmez",
          "Yedekleme ve bakım otomatik",
          "20 ek kullanıcıya kadar eş zamanlı çalışma",
          "1–20 çalışanlı, çok lokasyonlu ya da hibrit ekipler için",
        ],
      },
    ],
    when: {
      title: "Hangi sürüm size uygun?",
      items: [
        "Satış, stok ve faturayı birkaç kişiyle yürütüyor, ön muhasebeden fazlasını istiyorsanız: Jump Basic",
        "Genel muhasebe, bordro ya da üretim de sistemde olsun istiyorsanız: Mikro Jump",
        "Sunucu kurmadan, internet olan her yerden çalışmak istiyorsanız: Jump Bulut",
        "20'den fazla ek kullanıcı gerekiyorsa ya da grup şirketlerini konsolide raporluyorsanız: Mikro Fly",
      ],
    },
  },
  addons: [
    { title: "Mikro Hızlı Satış", body: "Satışı tek ekrandan yöneten hızlı satış ekranı." },
    { title: "Mikro e-Ticaret", body: "Web sitesi ve pazaryeri mağazalarını tek ekrandan yönetip e-Arşiv, e-Fatura kesme." },
    { title: "Mikro Şirketim", body: "Satış raporları, tahsilat-ödeme ve müşteri bakiyeleri mobil uygulamada." },
    { title: "Mikro Drive", body: "Verilerin buluta, belirlediğiniz saatte otomatik yedeklenmesi." },
    { title: "Nitrogen Depo Yönetimi", body: "Raf ve adres takibi, son kullanma tarihi ve anlık stok izleme." },
    { title: "Fastsell Restoran Yönetimi", body: "Paket sevkiyat, sipariş ve temassız sipariş süreçleri yiyecek-içecek işletmeleri için." },
  ],
  faq: [
    {
      q: "Jump Basic, Jump ve Jump Bulut arasındaki fark ne?",
      a: "Jump Basic ön muhasebeden fazlasını isteyenler için ara ERP: detaylı stok, satış, satın alma ve temel e-belgeler; finans modül olarak eklenir. Mikro Jump'ta finans ve bütçe ana pakette, genel muhasebe, personel ve üretim modül olarak eklenir; e-Defter ve e-Bordro da bu modüllerle kullanılır. Jump Bulut ise Mikro Jump'ın tarayıcıdan çalışan bulut sürümü.",
    },
    {
      q: "Aynı anda kaç kişi çalışabilir?",
      a: "Jump Basic'te 3 kullanıcı; Mikro Jump ve Jump Bulut'ta 20 ek kullanıcıya kadar eş zamanlı çalışılır. Daha fazlası gerekiyorsa Mikro Fly'da kullanıcı sınırı yok.",
    },
    {
      q: "Jump Bulut için sunucu ya da kurulum gerekir mi?",
      a: "Hayır. Tarayıcıdan çalışır; sunucu odası, ek işletim sistemi lisansı ya da donanım yatırımı gerekmez. Yedekleme ve bakım otomatik ilerler.",
    },
    {
      q: "Mikro Jump'ta üretim takibi var mı?",
      a: "Evet, temel üretim ve fason modülleriyle: malzeme planlaması, stok, maliyet ve muhasebe tek ekranda. Zaman, makine ve iş gücü kapasitesini de planlamanız gerekiyorsa Mikro Fly'daki MRP2'ye bakıyoruz.",
    },
    {
      q: "Hangi SQL Server sürümü gerekiyor?",
      a: "Mikro Jump SQL Server 2016 ve üzerinde çalışır; kurulumu biz yapıyoruz. Jump Bulut'ta sunucu gerekmez.",
    },
    SETUP_FAQ,
  ],
};

const FLY: ProductDetail = {
  slug: "mikro-fly",
  compareId: "mikro-fly",
  name: "Mikro Fly",
  logo: { src: "/images/mikro/fly.png", height: 56 },
  headline: "Üretimden holdinge, bütün şirketler tek merkezde",
  audience: "Büyük ölçekli şirketler, holdingler ve üreticiler",
  lead: "İleri seviye üretim planlama, gelişmiş insan kaynakları, CRM, uluslararası muhasebe ve iş zekasını tek merkezden yönetin.",
  metaDescription:
    "Mikro Fly: büyük ölçekli şirketler ve holdingler için MRP2, CRM, gelişmiş İK, UFRS uyumlu muhasebe ve iş zekası sunan kurumsal ERP. Analiz, kurulum ve eğitim GoTech'ten.",
  photo: { src: "/images/mikro-gorsel/uretim-hatti.webp", alt: "Tekstil üretim hattında çalışanlar" },
  intro: {
    title: "Büyük ölçekli işletmeler için Mikro Fly",
    body: "Mikro Fly; üretim, ileri muhasebe, insan kaynakları, CRM ve raporlamayı sınırsız kullanıcıyla tek çatı altında toplar. Holding ve çok şirketli yapılarda kurumsallaşmayı ve büyümeyi tek sistemden yönetirsiniz; API altyapısıyla kullandığınız diğer yazılımlar da Fly'a bağlanır. Süreç analizini, kurulumu ve eğitimi GoTech ekibi yapıyor.",
  },
  features: [
    { title: "İleri seviye üretim (MRP2)", body: "MRP2 modülüyle malzemenin yanında zaman, makine, iş istasyonu ve iş gücü birlikte planlanır: Gantt şeması, iş emirleri, operasyon rotaları, detaylı üretim maliyeti." },
    { title: "Gelişmiş insan kaynakları", body: "İK modülüyle bordro ve SGK'nın ötesinde çalışanların özgeçmiş, eğitim ve sertifika bilgileri dijitalde." },
    { title: "Müşteri ve tedarikçi ilişkileri (CRM)", body: "Satış, satın alma, teklif ve sipariş süreçleri geçmiş işlem verileriyle birlikte yönetilir." },
    { title: "İş zekası ve karar destek", body: "Satış, stok, kârlılık, tahsilat ve operasyon verileri üst yönetim için dinamik grafiklere ve karar destek ekranlarına dönüşür." },
    { title: "İleri muhasebe ve UFRS", body: "İleri seviye muhasebe modülüyle finansal tablolar uluslararası standartlara (UFRS) uygun; IAS 29 ve SPK uyumlu enflasyon muhasebesi." },
    { title: "Çok şirketli ve holding yapısı", body: "Birden fazla şirket, şube ve lokasyon tek merkezi sistemde takip edilir ve konsolide edilir." },
  ],
  forWhom: [
    { title: "50 ve üzeri çalışanı olan kurumsal firmalar", body: "Operasyon hacmi büyük, kurumsallaşma sürecindeki şirketler." },
    { title: "Holding ve çok şirketli yapılar", body: "Birden fazla şirketi tek sistemde yönetip konsolide etmek isteyenler." },
    { title: "Üreticiler", body: "İş emri, operasyon rotası ve fiili üretim maliyetini detaylı takip edenler." },
    { title: "Geniş bayi, saha satış ve depo ağı olanlar", body: "Lojistik ve depo süreçlerini WMS düzeyinde yönetenler dahil." },
    { title: "UFRS ve enflasyon muhasebesi uygulayanlar", body: "Finansal tablolarını uluslararası standartlara uygun hazırlaması gerekenler." },
  ],
  packageItems: [
    "Stok ve ürün yönetimi",
    "Satın alma ve tedarikçi yönetimi",
    "Satış ve müşteri yönetimi",
    "Hizmet ve masraf yönetimi",
    "Finans ve bütçe yönetimi",
    "Genel ve sabit kıymetler muhasebesi",
    "Personel yönetimi",
    "Üretim yönetimi",
    "Dış ticaret yönetimi",
    "Karar destek ve analiz",
  ],
  moduleItems: [
    "İleri seviye üretim yönetimi (MRP2)",
    "Gelişmiş fason yönetimi",
    "İleri seviye muhasebe (UFRS)",
    "İnsan kaynakları yönetimi",
    "Perakende yönetimi (yazar kasa, yeni nesil ÖKC)",
    "Promosyon",
    "Akaryakıt",
    "Tamir ve teknik servis",
    "Kiralanabilir varlık yönetimi",
  ],
  edonusumItems: [
    "e-Fatura, e-Arşiv, e-İrsaliye, e-Müstahsil",
    "e-Defter, e-Bordro, e-Mutabakat",
    "e-Z raporu, e-SMM",
  ],
  highlights: [
    { value: "Sınırsız", label: "eş zamanlı kullanıcı" },
    { value: "MRP2", label: "makine, zaman ve iş gücü planlama" },
    { value: "Çok şirket", label: "holding yapısı ve konsolidasyon" },
    { value: "UFRS", label: "uyumlu finansal raporlama" },
  ],
  badge: { src: "/images/flyer-silver.png", width: 324, height: 247, name: "Flyer Silver Partner" },
  diffFrom: "mikro-jump",
  addons: [
    { title: "Porkod Süreç Yönetimi", body: "Satıştan üretime her aşamayı planlama ve anlık bildirimler; Fly ile tam entegre." },
    { title: "Zeus WMS Depo Yönetimi", body: "Mikro'yla birlikte çalışan depo yönetim sistemi (Eryaz); kurup Mikro'ya bağlıyoruz." },
    { title: "B2B / B4B Bayi Yönetimi", body: "Bayi siparişi, saha satış ve performans takibi mobilde." },
    { title: "Mikro Şirketim", body: "Satış raporları, tahsilat-ödeme ve müşteri bakiyeleri mobil uygulamada." },
    { title: "Mikro e-Ticaret", body: "Web sitesi ve pazaryeri mağazalarını tek ekrandan yönetme." },
    { title: "Mikro Drive", body: "Verilerin buluta, belirlediğiniz saatte otomatik yedeklenmesi." },
  ],
  faq: [
    {
      q: "Mikro Fly ile Mikro Jump arasındaki fark ne?",
      a: "Mikro Jump'ta 20 ek kullanıcı sınırı var, Fly'da kullanıcı sınırı yok. Jump'taki temel üretim malzeme planlaması yaparken Fly'daki MRP2 zaman, makine ve iş gücü kapasitesini de planlar. CRM, iş zekası ve gelişmiş insan kaynakları modülleri yalnız Fly'da.",
    },
    {
      q: "Birden fazla şirketi tek sistemde yönetebilir miyiz?",
      a: "Evet. Birden fazla şirketi, şubeyi ve farklı lokasyonlardaki iş kollarını tek merkezden takip edip konsolide edersiniz.",
    },
    {
      q: "Yazar kasa ve yeni nesil ÖKC'lerle çalışır mı?",
      a: "Evet. Perakende yönetimi ek paketiyle yazar kasalar ve yeni nesil ÖKC'lerle veri alışverişi yapılır.",
    },
    {
      q: "Enflasyon muhasebesi ve UFRS raporlaması yapılabilir mi?",
      a: "Evet, İleri Seviye Muhasebe modülüyle: finansal tablolar UFRS'ye uygun hazırlanır; IAS 29 ve SPK uyumlu enflasyon muhasebesi yapılır.",
    },
    SETUP_FAQ,
  ],
};

export const PRODUCT_DETAILS: ProductDetail[] = [JUMP, FLY];

export const findProductDetail = (slug: string) => PRODUCT_DETAILS.find((p) => p.slug === slug);
