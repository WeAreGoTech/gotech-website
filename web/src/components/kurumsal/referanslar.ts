// Özel yazılım geliştirdiğimiz / hizmet verdiğimiz kurumlar (/referanslar ve ana sayfadaki logo şeridi).
// Yalnız GoTech'in onayladığı gerçek müşteriler; logo dosyaları public/images/referans.

export type Reference = {
  name: string;
  logo: { src: string; width: number; height: number };
  sector: string;
  // TODO(GoTech): projenin kendisi (ne geliştirildi, hangi süreç) netleşince bu genel cümle değiştirilsin
  work: string;
};

export const REFERENCES: Reference[] = [
  {
    name: "ASELSAN",
    // Wikimedia Commons, "ASELSAN logo.svg" (kamu malı, tescilli marka)
    logo: { src: "/images/referans/aselsan.svg", width: 160, height: 32 },
    sector: "Savunma sanayii",
    work: "Kurumsal süreçlere özel yazılım geliştirme ve destek.",
  },
];

// Yazılım çözümleri: ana sayfanın "Yazılım" bölümü ve /yazilim-cozumleri aynı iki iş türünü (SOFTWARE_TRACKS) gösterir.
// Yalnız GoTech'in gerçekten yaptığı işler; fotoğraflar CC0 (public/images/stok/KAYNAK.md).
export const INDEPENDENT_WORK = [
  { title: "Kurumsal web siteleri", body: "Kurumunuzu anlatan web sitesi; tasarımından yayına biz yapıyoruz." },
  { title: "E-ticaret", body: "Mikro'ya bağlı ya da bağımsız çalışan e-ticaret siteniz." },
  { title: "Müşteri ve bayi portalları", body: "Müşterilerinizin ya da bayilerinizin sipariş verdiği, talep açtığı, belge indirdiği portallar." },
  { title: "Ekip ve saha panelleri", body: "Sahadaki ekibinizin ya da ofisinizin günlük işini takip ettiği iş uygulamaları." },
];

export const MIKRO_WORK = [
  { title: "Mikro'ya özel ekran ve raporlar", body: "Mikro'ya entegre çalışan ek ekranlar ve işletmenize özel raporlar. Verileriniz Mikro'da kalır." },
  { title: "Bayi sipariş portalı ve saha satış", body: "Bayi siparişini ve saha satışı Mikro'ya bağlayan uygulamalar." },
  { title: "Kurup bağladığımız ek çözümler", body: "Zeus WMS, Mikro Hızlı Satış, Mikro Drive gibi çözümleri kurup Mikro'nuza bağlıyoruz." },
];

export type SoftwareTrack = {
  id: string;
  tag: string;
  title: string;
  body: string;
  image: string;
  items: { title: string; body: string }[];
};

export const SOFTWARE_TRACKS: SoftwareTrack[] = [
  {
    id: "mikroya-ozel",
    tag: "Mikro'ya bağlı",
    title: "Mikro'nun yetmediği yerde",
    body: "Mikro'yu değiştirmeden eksik kalan ekranı, raporu ya da bağlantıyı yazıyoruz; verileriniz yine Mikro'da kalır.",
    image: "/images/stok/rapor-tablet.webp",
    items: MIKRO_WORK,
  },
  {
    id: "bagimsiz",
    tag: "Mikro'dan bağımsız",
    title: "Web, e-ticaret, portal ve iş uygulamaları",
    body: "ERP dışındaki işlerinizi de aynı ekibe verebilirsiniz; Mikro kullanıyor olmanız gerekmez.",
    image: "/images/stok/web-cihazlar.webp",
    items: INDEPENDENT_WORK,
  },
];

// GoTech'in kendi geliştirip her gün kullandığı yazılımlar (bu projede: panel, yönetim, GoTech Desk)
export const OWN_SOFTWARE = [
  { title: "Müşteri portalı", body: "Müşterilerimiz destek taleplerini, projelerini, dokümanlarını ve uzak destek bağlantılarını tek yerden takip ediyor." },
  { title: "Yönetim paneli", body: "Müşteriler, talepler, projeler, cihazlar ve bu sitenin içeriği ekibimizin kendi panelinden yönetiliyor." },
  { title: "GoTech Desk", body: "Uzak destek için kendi masaüstü uygulamamız: müşterimizin bilgisayarına bağlanıp sorunu ekranında çözüyoruz." },
];
