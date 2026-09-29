// /yazilim-cozumleri: girişte ne tür yazılımlar geliştirdiğimiz (süzülebilir liste), sonra referans ve iletişim.
// İş listeleri referanslar.ts'ten (MIKRO_WORK, INDEPENDENT_WORK); yalnız GoTech'in gerçekten yaptığı işler.
import { INDEPENDENT_WORK, MIKRO_WORK } from "@/components/kurumsal/referanslar";

export type WorkKind = "mikro" | "bagimsiz";
export type Work = { title: string; body: string; kind: WorkKind };

export const KIND_LABEL: Record<WorkKind, string> = { mikro: "Mikro'ya bağlı", bagimsiz: "Mikro'dan bağımsız" };

// hazır çözümleri kurup bağlamak yazılım geliştirme değil: bu sayfada yalnız yazdığımız işler
const NOT_DEVELOPMENT = "Kurup bağladığımız ek çözümler";

export const WORKS: Work[] = [
  ...MIKRO_WORK.filter((w) => w.title !== NOT_DEVELOPMENT).map((w) => ({ ...w, kind: "mikro" as const })),
  ...INDEPENDENT_WORK.map((w) => ({ ...w, kind: "bagimsiz" as const })),
];

// TODO(GoTech): aşağıdaki üç blok (çalışma biçimi, teknik yaklaşım, SSS) ekibin onayından geçsin.
// Müşteri, süre ya da fiyat iddiası yok; yalnız nasıl çalıştığımızı anlatıyor.

/** Nasıl çalışıyoruz: ilk görüşmeden yayın sonrasına altı adım (ana sayfadaki yol haritasıyla aynı kalıp). */
export const SOFTWARE_STEPS = [
  {
    title: "Konuşalım",
    body: "Ne yapmak istediğinizi dinliyoruz; bugün hangi programları kullandığınızı ve işin kimlerin elinden geçtiğini çıkarıyoruz.",
    scope: ["Ücretsiz ilk görüşme", "Mevcut durumun çıkarılması"],
  },
  {
    title: "Kapsam ve teklif",
    body: "Yapılacak işi maddelere bölüyoruz. Hangi maddenin ilk sürümde olacağına birlikte karar veriyor, teklifi kalem kalem hazırlıyoruz.",
    scope: ["İş maddeleri", "İlk sürümün kapsamı", "Kalem kalem teklif"],
  },
  {
    title: "Ekran tasarımı",
    body: "Kod yazmadan önce ekranları tasarlıyoruz. Akışı sizinle konuşup onayınızı aldıktan sonra geliştirmeye başlıyoruz.",
    scope: ["Ekran taslakları", "Akış onayı"],
  },
  {
    title: "Geliştirme",
    body: "İşi parçalara bölüp ilerliyoruz; biten parçaları arada gösteriyoruz, geri bildiriminizi bir sonraki parçaya alıyoruz.",
    scope: ["Parça parça ilerleme", "Ara gösterimler"],
  },
  {
    title: "Yayın",
    body: "Uygulamayı sunucuya kuruyor, kullanıcıları ve yetkileri tanımlıyor, ekibinize kullanmayı gösteriyoruz.",
    scope: ["Kurulum", "Kullanıcı ve yetki tanımları", "Ekip eğitimi"],
  },
  {
    title: "Destek ve geliştirme",
    body: "Yayından sonraki taleplerinizi destek portalından açarsınız. Yeni bir ihtiyaç çıkarsa ayrıca konuşuyoruz.",
    scope: ["Destek portalı", "Yeni geliştirmeler"],
  },
];

/** Her işte geçerli dört ilke: teknik değil, müşterinin sorduğu sorular üzerinden. */
export const APPROACH = [
  {
    title: "Veriniz Mikro'da kalır",
    body: "Mikro'ya bağlı işlerde ayrı bir veri kopyası tutmuyoruz; geliştirdiğimiz ekran ve raporlar Mikro'nun kendi verisiyle çalışır.",
  },
  {
    title: "Telefonda da çalışır",
    body: "Geliştirdiğimiz portal ve panelleri telefon ve tablette de kullanabilirsiniz; ayrı bir uygulama kurmak gerekmez.",
  },
  {
    title: "Yetkiler kişiye göre",
    body: "Kimin neyi göreceğini ve değiştirebileceğini birlikte belirliyoruz; bayi bayisini, saha ekibi kendi işini görür.",
  },
  {
    title: "Nerede çalışacağı size kalmış",
    body: "Kendi sunucunuzda da çalışır, bizim kurduğumuz sunucuda da. Hangisinin size uygun olduğunu görüşmede konuşuyoruz.",
  },
];

export const YAZILIM_FAQ = [
  {
    q: "Mikro kullanmıyoruz, yine de çalışır mısınız?",
    a: "Evet. Web sitesi, e-ticaret, portal ve iş uygulamalarını Mikro'dan bağımsız da geliştiriyoruz; Mikro kullanıyor olmanız gerekmez.",
  },
  {
    q: "Ne kadar sürer?",
    a: "İşin kapsamına göre değişiyor. Kapsamı maddelere böldükten sonra, ilk sürüm için takvimi teklifle birlikte veriyoruz.",
  },
  {
    q: "Fiyat neye göre belirleniyor?",
    a: "Teklifte iş maddeleri kalem kalem yazılı; fiyat bu maddelere göre çıkıyor. Yayın sonrası destek ve yeni geliştirmeler ayrı satırlarda görünür.",
  },
  {
    q: "Yayından sonra ne oluyor?",
    a: "Talebinizi destek portalından açıyor, kimin üstlendiğini ve hangi aşamada olduğunu oradan takip ediyorsunuz. Yeni geliştirmeleri ayrıca konuşuyoruz.",
  },
];
