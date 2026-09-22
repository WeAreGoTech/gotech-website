// Landing page copy. Kaynak: gotech.com.tr (ana sayfa, hakkımızda, ürünler, hizmetler, iletişim).

export const NAV_LINKS = [
  { href: "#hizmetler", label: "Ürünler" },
  { href: "#isler", label: "Hizmetler" },
  { href: "#surec", label: "Süreç" },
  { href: "#sss", label: "SSS" },
  { href: "#iletisim", label: "İletişim" },
];

export const STATS = [
  { value: "15+", label: "Yıl deneyim" },
  { value: "500+", label: "Mutlu müşteri" },
  { value: "7/24", label: "Teknik destek" },
  { value: "%100", label: "Müşteri memnuniyeti" },
];

export const PRODUCTS = [
  {
    id: "urun-run",
    title: "Mikro Run",
    image: "Görsel alanı: Mikro Run ekranı",
    text: "Esnaf, serbest meslek sahibi ve mikro işletmeler için kolay kullanımlı, ekonomik ERP çözümü. e-Dönüşüm paketi dahil.",
    includes: ["Faturalama", "Stok takibi", "e-Dönüşüm", "Raporlar"],
    audience: "1-5 çalışan",
  },
  {
    id: "urun-jump",
    title: "Mikro Jump",
    image: "Görsel alanı: Mikro Jump ekranı",
    text: "Küçük ve orta ölçekli işletmeler için kapsamlı ERP çözümü. İşiniz büyüdükçe yazılımınız da sizinle birlikte büyür.",
    includes: ["Satış yönetimi", "Depo yönetimi", "Muhasebe", "Üretim"],
    audience: "5-50 çalışan",
    badge: "Popüler",
  },
  {
    id: "urun-fly",
    title: "Mikro Fly",
    image: "Görsel alanı: Mikro Fly ekranı",
    text: "Büyük ölçekli işletmeler, grup şirketleri ve holdingler için tam entegre kurumsal ERP platformu.",
    includes: ["Holding yönetimi", "İş zekası", "İnsan kaynakları", "Üretim planlama"],
    audience: "50+ çalışan",
    badge: "Kurumsal",
  },
  {
    id: "urun-musavir",
    title: "Mikro Müşavir",
    image: "Görsel alanı: Mikro Müşavir ekranı",
    text: "Serbest muhasebeciler ve mali müşavirler için özel tasarlanmış, mükellef yönetimini kolaylaştıran profesyonel çözüm.",
    includes: ["Defter beyan", "Mükellef yönetimi", "e-SMM", "Beyannameler"],
    audience: "Mali müşavirler",
  },
];

export const EDONUSUM = [
  "e-Fatura",
  "e-Arşiv Fatura",
  "e-İrsaliye",
  "e-Defter",
  "e-Mutabakat",
  "e-SMM",
  "e-Müstahsil",
  "e-Bordro",
];

export const ADDONS = [
  { title: "Zeus WMS", text: "Yapay zeka destekli depo yönetim sistemi.", tags: ["Stok takibi", "Raf yönetimi", "Barkod", "SKT takibi"] },
  { title: "B2B / B4B", text: "Bayi ve saha satış yönetim sistemi.", tags: ["Online sipariş", "Bayi portalı", "Saha satış", "Mobil uygulama"] },
  { title: "Mikro Hızlı Satış", text: "Perakende satış noktası (POS) çözümü.", tags: ["Hızlı satış", "Barkod okuma", "Kasa yönetimi", "Z raporu"] },
  { title: "E-Ticaret entegrasyonu", text: "Pazaryeri ve web mağaza entegrasyonu.", tags: ["Trendyol", "Hepsiburada", "N11", "Amazon"] },
  { title: "Mikro Drive", text: "Bulut yedekleme ve dosya paylaşımı.", tags: ["Otomatik yedekleme", "Dosya paylaşımı", "Güvenli depolama"] },
  { title: "Mikro Şirketim", text: "Mobil işletme yönetimi uygulaması.", tags: ["Satış raporları", "Tahsilat takibi", "Cari bakiye", "Bildirimler"] },
];

export const SERVICES = [
  { title: "İş analizi", text: "İşletmenizin ihtiyaçlarını detaylı analiz ederek en uygun çözümü belirliyoruz.", items: ["Mevcut süreç analizi", "İhtiyaç tespiti", "Çözüm önerisi", "Maliyet analizi"] },
  { title: "Kurulum & entegrasyon", text: "Yazılımınızı profesyonelce kuruyor, mevcut sistemlerinizle entegre ediyoruz.", items: ["Yazılım kurulumu", "Veri aktarımı", "Sistem entegrasyonu", "Özelleştirme"] },
  { title: "Eğitim", text: "Ekibinizi yazılımı etkin kullanabilmeleri için kapsamlı eğitimlerle donatıyoruz.", items: ["Kullanıcı eğitimi", "Yönetici eğitimi", "Online eğitim", "Eğitim dokümanları"] },
  { title: "Teknik destek", text: "7/24 teknik destek hizmetimizle her an yanınızdayız.", items: ["Telefon desteği", "Uzaktan erişim", "Yerinde destek", "Öncelikli müdahale"] },
  { title: "Güncelleme & bakım", text: "Yazılımınızı güncel tutuyor, performansını sürekli izliyoruz.", items: ["Versiyon güncellemesi", "Güvenlik yamaları", "Performans optimizasyonu", "Yedekleme"] },
  { title: "e-Dönüşüm danışmanlığı", text: "e-Fatura, e-Defter ve tüm e-belge süreçlerinizde uzman danışmanlık.", items: ["GİB başvuruları", "Sistem kurulumu", "Entegratör bağlantısı", "Yasal uyumluluk"] },
];

export const PROCESS_STEPS = [
  { title: "İletişim", text: "Bize ulaşın, ihtiyaçlarınızı dinleyelim." },
  { title: "Analiz", text: "İşletmenizi ve mevcut süreçlerinizi analiz edelim." },
  { title: "Teklif", text: "İhtiyacınıza göre size özel çözüm ve fiyat sunalım." },
  { title: "Kurulum", text: "Yazılımı kuralım, verilerinizi aktaralım, sistemlerinizle entegre edelim." },
  { title: "Eğitim", text: "Ekibinizi kullanıcı ve yönetici eğitimleriyle hazırlayalım." },
  { title: "Destek", text: "7/24 teknik destek, güncelleme ve bakımla yanınızda olalım." },
];

export const COMPARE_ROWS = [
  { topic: "Çalışan sayısı", run: "1-5", jump: "5-50", fly: "50+" },
  { topic: "Stok yönetimi", run: "Var", jump: "Var", fly: "Var" },
  { topic: "e-Dönüşüm", run: "Temel", jump: "Tam", fly: "Tam" },
  { topic: "Üretim modülü", run: "—", jump: "Var", fly: "Var" },
  { topic: "Çoklu şirket", run: "—", jump: "—", fly: "Var" },
  { topic: "İnsan kaynakları", run: "—", jump: "Temel", fly: "Gelişmiş" },
];

export const VALUES = [
  { title: "Müşteri odaklılık", text: "Her projede müşteri memnuniyetini ön planda tutuyoruz." },
  { title: "Sürekli gelişim", text: "Teknolojik gelişmeleri takip ederek en güncel çözümleri sunuyoruz." },
  { title: "Güven & şeffaflık", text: "İş ortaklarımızla güvene dayalı ilişkiler kuruyoruz." },
  { title: "Kalite standartları", text: "En yüksek kalite standartlarında hizmet veriyoruz." },
];

export const FAQ_ITEMS = [
  { q: "GoTech tam olarak ne yapıyor?", a: "Mikro Yazılım İş Ortağı'yız. 2017'den beri Mikro Yazılım'ın ERP ürünlerini işletmelere kuruyor, iş analizinden eğitime ve 7/24 teknik desteğe kadar sürecin tamamında yanınızda oluyoruz." },
  { q: "Hangi ürün bize uygun?", a: "İşletmenizin büyüklüğüne göre değişir: 1-5 çalışan için Mikro Run, 5-50 çalışan için Mikro Jump, 50+ çalışan ve grup şirketleri için Mikro Fly. Mali müşavirler için ayrıca Mikro Müşavir var. Ücretsiz danışmanlıkta birlikte netleştiriyoruz." },
  { q: "e-Fatura ve e-Defter dahil mi?", a: "Mikro Jump ve Mikro Fly ürünlerinde tüm e-Dönüşüm çözümleri dahildir. Mikro Run'da e-Dönüşüm paketi ürünün içinde gelir. GİB başvurusu, entegratör bağlantısı ve yasal uyumluluk sürecinde de danışmanlık veriyoruz." },
  { q: "Mevcut verilerimizi aktarabilir miyiz?", a: "Evet. Veri aktarımı kurulum hizmetimizin bir parçası. Kurulum sırasında mevcut sistemlerinizle entegrasyonu da biz yapıyoruz." },
  { q: "Ekibimiz yazılımı kullanmayı nasıl öğrenecek?", a: "Kurulumdan sonra kullanıcı ve yönetici eğitimleri veriyoruz. Online eğitim ve eğitim dokümanları da sağlıyoruz." },
  { q: "Kurulumdan sonra destek veriyor musunuz?", a: "7/24 teknik destek veriyoruz: telefon desteği, uzaktan erişim, yerinde destek ve öncelikli müdahale. Ayrıca versiyon güncellemesi, güvenlik yamaları ve yedekleme bakım hizmetimize dahil." },
  { q: "E-ticaret sitemizle veya depomuzla entegre olur mu?", a: "Olur. Trendyol, Hepsiburada, N11 ve Amazon için pazaryeri entegrasyonu, depo için Zeus WMS, bayi ve saha satış için B2B/B4B çözümümüz var." },
];

export const CONTACT_INFO = [
  { label: "Satış", value: "0 532 468 12 47", href: "tel:+905324681247" },
  { label: "Destek", value: "0 507 679 19 25", href: "tel:+905076791925" },
  { label: "E-posta", value: "info@gotech.com.tr", href: "mailto:info@gotech.com.tr" },
  { label: "Adres", value: "Şehit Nevres Bulvarı, Deren Plaza No:10 K:1, Alsancak – İzmir" },
];

export const CONTACT_SUBJECTS = [
  "Genel bilgi",
  "Demo talebi",
  "Fiyat teklifi",
  "Teknik destek",
  "İş ortaklığı",
  "Diğer",
];
