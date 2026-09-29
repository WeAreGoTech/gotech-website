// Özel yazılım geliştirdiğimiz / hizmet verdiğimiz kurumlar (/referanslar ve ana sayfadaki logo şeridi).
// Yalnız GoTech'in onayladığı gerçek müşteriler; logo dosyaları public/images/referans.

export type Reference = {
  name: string;
  logo: { src: string; width: number; height: number };
  sector: string;
  // TODO(GoTech): projenin kendisi (ne geliştirildi, hangi süreç) netleşince bu genel cümle değiştirilsin
  work: string;
};

// referans logolarının yanındaki etiket
export const REFERENCES_LABEL = "Özel yazılım geliştirdiğimiz kurumlar";

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
  { title: "E-ticaret", body: "İşletmenizin e-ticaret sitesi; isterseniz Mikro'nuzla bağlantılı." },
  { title: "Müşteri ve bayi portalları", body: "Müşterilerinizin ya da bayilerinizin sipariş verdiği, talep açtığı, belge indirdiği portallar." },
  { title: "Ekip ve saha panelleri", body: "Sahadaki ekibinizin ya da ofisinizin günlük işini takip ettiği iş uygulamaları." },
];

export const MIKRO_WORK = [
  { title: "Mikro'ya özel ekran ve raporlar", body: "Mikro'ya entegre çalışan ek ekranlar ve işletmenize özel raporlar." },
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
    tag: "Mikro'ya özel",
    title: "Mikro'ya özel geliştirmeler",
    body: "İşletmenize özel ekran, rapor ve bağlantılar geliştiriyoruz.",
    image: "/images/stok/rapor-tablet.webp",
    items: MIKRO_WORK,
  },
  {
    id: "bagimsiz",
    tag: "Web ve portal",
    title: "Web, e-ticaret, portal ve iş uygulamaları",
    body: "Kurumsal web sitesi, e-ticaret ve portal projelerinizi de aynı ekip yapıyor.",
    image: "/images/stok/web-cihazlar.webp",
    items: INDEPENDENT_WORK,
  },
];

