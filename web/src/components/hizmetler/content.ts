// /hizmetlerimiz: sayfa müşterinin sorularıyla kurulu. Girişte beş soru, her soru bir bölüm (id sayfa içi bağlantı).
// Cevaplarda yalnız GoTech'in doğruladığı bilgiler var (SERVICE_TABS ve SSS'teki cümlelerden). Süre, rakam, garanti yazılmaz.

export type Question = { id: string; service: string; q: string; a: string };

export const QUESTIONS: Question[] = [
  {
    id: "analiz",
    service: "Analiz ve teklif",
    q: "Hangi Mikro bizim işimize uyar?",
    a: "İşinizi dinliyor; bugün ne kullandığınızı, kaç kişinin çalışacağını ve süreçlerinizi çıkarıyoruz. Ürünü ve modülleri birlikte belirliyor, teklifi kalem kalem hazırlıyoruz.",
  },
  {
    id: "kurulum",
    service: "Kurulum ve entegrasyon",
    q: "Kurulumu kim yapacak, nasıl ilerleyecek?",
    a: "İlk görüşmeden canlı kullanıma aynı ekip. Mikro'yu kuruyor, kullanıcıları ve yetkileri tanımlıyor; Zeus WMS, B2B/B4B gibi ek çözümleri Mikro'ya bağlıyoruz. Süreyi keşif görüşmesinde işletmenize göre netleştiriyoruz.",
  },
  {
    id: "edonusum",
    service: "e-Dönüşüm",
    q: "e-Fatura, e-Defter bize zorunlu mu?",
    a: "Hangi e-belgelerin sizin için zorunlu olduğunu çıkarıyor; GİB başvurusunu, entegratör bağlantısını ve Mikro'daki ayarları yapıyoruz. Belgeler programın içinden, kontörle kesilir.",
  },
  {
    id: "egitim",
    service: "Eğitim",
    q: "Ekibimiz programı nasıl öğrenecek?",
    a: "Kurulumdan sonra kullanıcılarınıza ve yöneticilere programı kendi işleriniz üzerinden öğretiyoruz.",
  },
  {
    id: "destek",
    service: "Destek",
    q: "Bir sorun olunca kime ulaşacağız?",
    a: "GoTech ekibine. Talebinizi destek portalından açıyor, kimin üstlendiğini ve hangi aşamada olduğunu oradan görüyorsunuz.",
  },
];

export const questionById = (id: string) => QUESTIONS.find((x) => x.id === id) as Question;

// Kurulum bölümündeki altı adımın fotoğrafları (PROCESS_STEPS sırasıyla)
export const STEP_IMAGES = [
  "/images/stok/destek-gorusme.webp",
  "/images/stok/analiz-atolye.webp",
  "/images/stok/rapor-tablet.webp",
  "/images/stok/kurulum-ekip.webp",
  "/images/stok/egitim-sunum.webp",
  "/images/mikro-gorsel/edonusum-ofis.webp",
];

export const ANALYSIS_ITEMS = ["Ücretsiz keşif görüşmesi", "Süreç analizi", "Ürün ve modül önerisi", "Lisans ya da kiralama teklifi"];
export const TRAINING_ITEMS = ["Kullanıcı eğitimi", "Yönetici eğitimi"];
