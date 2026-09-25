// Ürün sayfalarındaki "GoTech ile kurulum" adımları: ana sayfadaki hizmet adımlarıyla (urunler-data PROCESS_STEPS) aynı altı
// başlık, ürüne göre ayrıntılı. Süre, teslim tarihi ve fiyat gibi sözler GoTech yazılı olarak onaylamadan yazılmaz.

import { PROCESS_STEPS } from "./urunler-data";

export type SetupStep = { title: string; body: string; note?: string };

const INSTALL: Record<string, string> = {
  "mikro-jump":
    "Mikro Jump'ı sunucunuza ya da bilgisayarlarınıza kuruyor, kullanıcıları ve yetkileri tanımlıyoruz; Jump Bulut'ta sunucu kurulumu yok.",
  "mikro-fly": "Mikro Fly'ı sunucunuza kuruyor; şirketleri, şubeleri, kullanıcıları ve yetkileri tanımlıyoruz.",
};

type SetupContext = { slug: string; workingHours: string; hasPhone: boolean };

export function setupSteps({ slug, workingHours, hasPhone }: SetupContext): SetupStep[] {
  const bodies = [
    { body: "Formu doldurun ya da e-posta gönderin; ihtiyacınızı dinlemek için bir keşif görüşmesi planlıyoruz.", note: "Ücretsiz" },
    { body: "Kaç kişinin aynı anda çalışacağını, süreçlerinizi ve bugün ne kullandığınızı çıkarıyor; hangi sürüm ve modüllerin gerektiğini birlikte belirliyoruz." },
    {
      body: "Teklifte ayrı satırlar: lisans ya da kiralama bedeli (ana paket, seçtiğiniz modüller, kullanıcı sayısı), kurulum, yıllık bakım, e-dönüşüm kontörü.",
    },
    {
      body: `${INSTALL[slug] ?? "Programı kuruyor, kullanıcıları ve yetkileri tanımlıyoruz."} GİB başvurusunu, entegratör bağlantısını ve e-belge ayarlarını yapıyoruz.`,
    },
    { body: "Kullanıcılarınıza ve yöneticilere programı kendi işleriniz üzerinden öğretiyoruz." },
    {
      body: `Kurulumdan sonra destek de bizden: ${workingHours.toLocaleLowerCase("tr")}${hasPhone ? " telefon," : ""} GoTech Desk ile uzak bağlantı ve destek portalı; gerektiğinde yerinde.`,
    },
  ];
  return PROCESS_STEPS.map((step, i) => ({ title: step.title, ...bodies[i] }));
}
